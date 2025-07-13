import React, { useState, useEffect } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../services/supabase";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(null);

  // Load users from Supabase
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select(`
          id,
          username,
          name,
          email,
          nft_balance,
          can_upload,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setUsers(data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      setUpdating(editedUser.id);
      setError("");
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: editedUser.name,
          nft_balance: parseInt(editedUser.nft_balance) || 0,
        })
        .eq("id", editedUser.id);

      if (updateError) throw updateError;

      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === editedUser.id ? editedUser : u))
      );
      
      setEditingUserId(null);
      setSuccess("User updated successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ 
      ...editedUser, 
      [name]: name === 'nft_balance' ? parseInt(value) || 0 : value 
    });
  };

  // This is the button that sets canUpload to true for a user
  const handleGrantUploadPermission = async (userId) => {
    try {
      setUpdating(userId);
      setError("");
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          can_upload: true
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Update local state
      setUsers((prev) =>
        prev.map((u) => 
          u.id === userId 
            ? { ...u, can_upload: true } 
            : u
        )
      );
      
      setSuccess("Upload permission granted successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error granting upload permission:", err);
      setError("Failed to grant upload permission: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  // Button to revoke upload permission
  const handleRevokeUploadPermission = async (userId) => {
    try {
      setUpdating(userId);
      setError("");
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          can_upload: false
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Update local state
      setUsers((prev) =>
        prev.map((u) => 
          u.id === userId 
            ? { ...u, can_upload: false } 
            : u
        )
      );
      
      setSuccess("Upload permission revoked successfully!");
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      console.error("Error revoking upload permission:", err);
      setError("Failed to revoke upload permission: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>User Management</h2>
      
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Table bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>NFT Balance</th>
            <th>Upload Permission</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) =>
              editingUserId === user.id ? (
                <tr key={user.id}>
                  <td>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editedUser.name || ""}
                      onChange={handleChange}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <Form.Control
                      type="number"
                      name="nft_balance"
                      value={editedUser.nft_balance || 0}
                      onChange={handleChange}
                      min="0"
                    />
                  </td>
                  <td>
                    <span className={`badge ${user.can_upload ? 'bg-success' : 'bg-danger'}`}>
                      {user.can_upload ? 'Allowed' : 'Denied'}
                    </span>
                  </td>
                  <td>
                    <Button 
                      variant="success" 
                      onClick={handleSave} 
                      size="sm"
                      disabled={updating === user.id}
                    >
                      {updating === user.id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Save"
                      )}
                    </Button>{" "}
                    <Button
                      variant="secondary"
                      onClick={() => setEditingUserId(null)}
                      size="sm"
                      disabled={updating === user.id}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ) : (
                <tr key={user.id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge bg-info">
                      {user.nft_balance || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.can_upload ? 'bg-success' : 'bg-danger'}`}>
                      {user.can_upload ? 'Allowed' : 'Denied'}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEditClick(user)}
                      size="sm"
                      className="me-1"
                      disabled={updating === user.id}
                    >
                      Edit
                    </Button>
                    
                    {user.can_upload ? (
                      <Button
                        variant="danger"
                        onClick={() => handleRevokeUploadPermission(user.id)}
                        size="sm"
                        className="me-1"
                        disabled={updating === user.id}
                      >
                        {updating === user.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Revoke Upload"
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleGrantUploadPermission(user.id)}
                        size="sm"
                        className="me-1"
                        disabled={updating === user.id}
                      >
                        {updating === user.id ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Grant Upload"
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminUsers;
