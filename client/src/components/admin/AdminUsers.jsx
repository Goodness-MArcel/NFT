import React, { useState, useEffect } from "react";
import { Table, Button, Form, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function AdminUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updating, setUpdating] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  


const [nfts, setNfts] = useState([]);
const [showNftSection, setShowNftSection] = useState(false);
const [loadingNfts, setLoadingNfts] = useState(false);
const [selectedUserId, setSelectedUserId] = useState(null);
const [editingNftId, setEditingNftId] = useState(null);
const [editedNft, setEditedNft] = useState({});
const [deletingNftId, setDeletingNftId] = useState(null);

// Load NFTs for a specific user or all NFTs
const loadNfts = async (userId = null) => {
  try {
    setLoadingNfts(true);
    setError("");

    let query = supabase
      .from("nfts")
      .select(`
        id,
        title,
        description,
        price,
        image_url,
        category,
        status,
        created_at,
        user_id,
        profiles!inner(username, name, email)
      `)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) throw fetchError;

    setNfts(data || []);
    setSelectedUserId(userId);
  } catch (err) {
    console.error("Error loading NFTs:", err);
    setError("Failed to load NFTs: " + err.message);
  } finally {
    setLoadingNfts(false);
  }
};

// Delete NFT
const handleDeleteNft = async (nftId) => {
  if (!window.confirm("Are you sure you want to delete this NFT? This action cannot be undone.")) {
    return;
  }

  try {
    setDeletingNftId(nftId);
    setError("");

    const { error: deleteError } = await supabase
      .from("nfts")
      .delete()
      .eq("id", nftId);

    if (deleteError) throw deleteError;

    setNfts(prev => prev.filter(nft => nft.id !== nftId));
    setSuccess("NFT deleted successfully!");
    setTimeout(() => setSuccess(""), 3000);
  } catch (err) {
    console.error("Error deleting NFT:", err);
    setError("Failed to delete NFT: " + err.message);
  } finally {
    setDeletingNftId(null);
  }
};

// Edit NFT
const handleEditNft = (nft) => {
  setEditingNftId(nft.id);
  setEditedNft({ ...nft });
};

// Save NFT changes
const handleSaveNft = async () => {
  try {
    setUpdating(editedNft.id);
    setError("");

    const updateData = {
      title: editedNft.title,
      description: editedNft.description,
      price: parseFloat(editedNft.price) || 0,
      category: editedNft.category,
      status: editedNft.status
    };

    const { error: updateError } = await supabase
      .from("nfts")
      .update(updateData)
      .eq("id", editedNft.id);

    if (updateError) throw updateError;

    setNfts(prev => 
      prev.map(nft => 
        nft.id === editedNft.id 
          ? { ...nft, ...updateData }
          : nft
      )
    );

    setEditingNftId(null);
    setSuccess("NFT updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  } catch (err) {
    console.error("Error updating NFT:", err);
    setError("Failed to update NFT: " + err.message);
  } finally {
    setUpdating(null);
  }
};

// Handle NFT form changes
const handleNftChange = (e) => {
  const { name, value } = e.target;
  setEditedNft({
    ...editedNft,
    [name]: name === "price" ? parseFloat(value) || 0 : value
  });
};


  // Check if current user is admin
  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("admin_role")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.admin_role || false);

      if (!data?.admin_role) {
        setError("Access denied. Admin privileges required.");
      }
    } catch (err) {
      console.error("Error checking admin role:", err);
      setError("Failed to verify admin privileges.");
      setIsAdmin(false);
    }
  };

  // Load users from Supabase
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select(
          `
          id,
          username,
          name,
          email,
          bio,
          location,
          website,
          twitter,
          instagram,
          nft_balance,
          can_upload,
          admin_role,
          created_at
        `
        )
        .order("created_at", { ascending: false });

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
    if (currentUser) {
      checkAdminRole();
    }
  }, [currentUser]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      setUpdating(editedUser.id);
      setError("");

      // Prepare update data - include all editable fields
      const updateData = {
        name: editedUser.name || null,
        username: editedUser.username || null,
        bio: editedUser.bio || null,
        location: editedUser.location || null,
        website: editedUser.website || null,
        twitter: editedUser.twitter || null,
        instagram: editedUser.instagram || null,
        nft_balance: parseFloat(editedUser.nft_balance) || 0,
        can_upload: editedUser.can_upload || false,
        admin_role: editedUser.admin_role || false,
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
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
    const { name, value, type, checked } = e.target;
    setEditedUser({
      ...editedUser,
      [name]:
        type === "checkbox"
          ? checked
          : name === "nft_balance"
          ? parseFloat(value) || 0
          : value,
    });
  };

  // Grant upload permission
  const handleGrantUploadPermission = async (userId) => {
    try {
      setUpdating(userId);
      setError("");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ can_upload: true })
        .eq("id", userId);

      if (updateError) throw updateError;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, can_upload: true } : u))
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

  // Revoke upload permission
  const handleRevokeUploadPermission = async (userId) => {
    try {
      setUpdating(userId);
      setError("");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ can_upload: false })
        .eq("id", userId);

      if (updateError) throw updateError;

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, can_upload: false } : u))
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

  // Toggle admin role
  const handleToggleAdminRole = async (userId, currentAdminStatus) => {
    try {
      setUpdating(userId);
      setError("");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ admin_role: !currentAdminStatus })
        .eq("id", userId);

      if (updateError) throw updateError;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, admin_role: !currentAdminStatus } : u
        )
      );

      setSuccess(
        `Admin role ${
          !currentAdminStatus ? "granted" : "revoked"
        } successfully!`
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating admin role:", err);
      setError("Failed to update admin role: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="container mt-4 text-center">
        <Alert variant="warning">Please log in to access admin panel.</Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4 text-center">
        <Alert variant="danger">
          Access Denied. You need admin privileges to access this page.
        </Alert>
      </div>
    );
  }

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <div className="badge bg-success">Admin Panel</div>
      </div>

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

      <div className="table-responsive">
        <Table bordered hover className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Bio</th>
              <th>Location</th>
              <th>NFT Balance</th>
              <th>Upload</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) =>
                editingUserId === user.id ? (
                  <tr key={user.id} className="table-warning">
                    <td>
                      <Form.Control
                        type="text"
                        name="name"
                        value={editedUser.name || ""}
                        onChange={handleChange}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="username"
                        value={editedUser.username || ""}
                        onChange={handleChange}
                        size="sm"
                      />
                    </td>
                    <td>
                      <small className="text-muted">{user.email}</small>
                    </td>
                    <td>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="bio"
                        value={editedUser.bio || ""}
                        onChange={handleChange}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        name="location"
                        value={editedUser.location || ""}
                        onChange={handleChange}
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        name="nft_balance"
                        value={editedUser.nft_balance || 0}
                        onChange={handleChange}
                        min="0"
                        step="0.001"
                        size="sm"
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        name="can_upload"
                        checked={editedUser.can_upload || false}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        name="admin_role"
                        checked={editedUser.admin_role || false}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <div className="d-flex gap-1">
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
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setEditingUserId(null)}
                          size="sm"
                          disabled={updating === user.id}
                        >
                          Cancel
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={user.id}>
                    <td>{user.name || "N/A"}</td>
                    <td>{user.username}</td>
                    <td>
                      <small>{user.email}</small>
                    </td>
                    <td>
                      <small>
                        {user.bio
                          ? user.bio.length > 50
                            ? user.bio.substring(0, 50) + "..."
                            : user.bio
                          : "N/A"}
                      </small>
                    </td>
                    <td>
                      <small>{user.location || "N/A"}</small>
                    </td>
                    <td>
                      {/* <span className="badge bg-info">
                        {(user.nft_balance || 0).toFixed(3)} ETH
                      </span> */}
                      <span className="badge bg-info">
                        {Number(user.nft_balance || 0) % 1 === 0
                          ? `${user.nft_balance} ETH`
                          : `${Number(user.nft_balance || 0).toFixed(3)} ETH`}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.can_upload ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {user.can_upload ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.admin_role ? "bg-warning" : "bg-secondary"
                        }`}
                      >
                        {user.admin_role ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(user)}
                          size="sm"
                          disabled={updating === user.id}
                        >
                          <i className="fas fa-edit"></i>
                        </Button>

                        <Button
                          variant={
                            user.can_upload
                              ? "outline-danger"
                              : "outline-success"
                          }
                          onClick={() =>
                            user.can_upload
                              ? handleRevokeUploadPermission(user.id)
                              : handleGrantUploadPermission(user.id)
                          }
                          size="sm"
                          disabled={updating === user.id}
                        >
                          {updating === user.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <i
                              className={`fas ${
                                user.can_upload ? "fa-times" : "fa-check"
                              }`}
                            ></i>
                          )}
                        </Button>
                        <Button
                          variant={
                            user.admin_role ? "outline-warning" : "outline-info"
                          }
                          onClick={() =>
                            handleToggleAdminRole(user.id, user.admin_role)
                          }
                          size="sm"
                          disabled={
                            updating === user.id || user.id === currentUser.id
                          }
                          title={
                            user.id === currentUser.id
                              ? "Cannot modify your own admin role"
                              : user.admin_role
                              ? "Remove admin role"
                              : "Grant admin role"
                          }
                        >
                          {updating === user.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <i
                              className={`fas ${
                                user.admin_role
                                  ? "fa-user-minus"
                                  : "fa-user-plus"
                              }`}
                            ></i>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </Table>
      </div>

      

      <div className="mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-info-circle me-2"></i>
                  Admin Actions
                </h5>
                <ul className="list-unstyled">
                  <li>
                    <i className="fas fa-edit text-primary me-2"></i>Edit user
                    profiles
                  </li>
                  <li>
                    <i className="fas fa-check text-success me-2"></i>
                    Grant/revoke upload permissions
                  </li>
                  <li>
                    <i className="fas fa-user-plus text-info me-2"></i>Manage
                    admin roles
                  </li>
                  <li>
                    <i className="fas fa-coins text-warning me-2"></i>Update NFT
                    balances
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-chart-bar me-2"></i>
                  Statistics
                </h5>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border-end">
                      <h4 className="text-primary">{users.length}</h4>
                      <small className="text-muted">Total Users</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <h4 className="text-success">
                        {users.filter((u) => u.can_upload).length}
                      </h4>
                      <small className="text-muted">Can Upload</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <h4 className="text-warning">
                      {users.filter((u) => u.admin_role).length}
                    </h4>
                    <small className="text-muted">Admins</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
