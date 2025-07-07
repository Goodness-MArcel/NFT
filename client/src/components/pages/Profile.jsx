import React, { useState, useRef, useEffect } from "react";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const { currentUser } = useAuth();
  const [nfts, setNfts] = useState([]);
  const [newNft, setNewNft] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    imagePreview: null,
    category: "Art",
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name:
      currentUser?.displayName || currentUser?.email?.split("@")[0] || "User",
    username: currentUser?.email?.split("@")[0] || "user",
    bio: "",
    avatar: null,
    cover_image: null,
    location: "",
    website: "",
    twitter: "",
    instagram: "",
  });

  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  console.log(userProfile);
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
      loadUserNfts();
    }
  }, [currentUser]);

  const loadUserProfile = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/users/${currentUser.uid}`
      );
      if (!res.ok) throw new Error("Could not load profile");
      const data = await res.json();
      setUserProfile((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile.");
    }
  };

  const loadUserNfts = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/nfts?owner=${currentUser.uid}`
      );
      if (!res.ok) throw new Error("Could not load NFTs");
      const data = await res.json();
      setNfts(data);
    } catch (err) {
      console.error("Error loading NFTs:", err);
      setError("Failed to load NFTs.");
    }
  };

  const handleImageUpload = async (event, type = "avatar") => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return setError("Max file size is 10MB.");
    if (!file.type.startsWith("image/"))
      return setError("Invalid image format.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("uid", currentUser.uid);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/users/upload-image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      const fieldName = type === "cover" ? "cover_image" : type;
      setUserProfile((prev) => ({ ...prev, [fieldName]: data.url }));
      setSuccess(
        `${type === "avatar" ? "Profile picture" : "Cover image"} updated!`
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err.message);
      setError("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleNftImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Image too large (max 10MB)");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewNft((prev) => ({
        ...prev,
        image: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNftUpload = async (e) => {
    e.preventDefault();
    if (!newNft.title || !newNft.image || !newNft.price) {
      setError("Fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append("image", newNft.image);
      formData.append("title", newNft.title);
      formData.append("description", newNft.description);
      formData.append("price", newNft.price);
      formData.append("category", newNft.category);
      formData.append("owner", currentUser.uid);
      formData.append("ownerEmail", currentUser.email);

      const res = await fetch(`${API_BASE}/api/nfts`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const newItem = await res.json();
      setNfts((prev) => [newItem, ...prev]);

      setNewNft({
        title: "",
        description: "",
        price: "",
        image: null,
        imagePreview: null,
        category: "Art",
      });
      setShowUploadModal(false);
      setUploadProgress(100);
      setSuccess("NFT uploaded!");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("NFT upload error:", err);
      setError("NFT upload failed.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        uid: currentUser.uid,
        email: currentUser.email,
        ...editProfile,
      };
      const res = await fetch(
        `${API_BASE}/api/users/${currentUser.uid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setUserProfile((prev) => ({ ...prev, ...updated }));
      setShowEditProfileModal(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const openEditProfile = () => {
    setEditProfile({ ...userProfile });
    setShowEditProfileModal(true);
  };

  // Styles
  const profileStyles = {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "Inter, serif",
  };

  const headerStyles = {
    background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
    color: "#ecf0f1",
    minHeight: "300px",
    position: "relative",
  };

  const cardStyles = {
    backgroundColor: "#ffffff",
    border: "1px solid #dee2e6",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    // padding: '10px'
  };

  const buttonPrimaryStyles = {
    backgroundColor: "#8b4513",
    borderColor: "#8b4513",
    color: "#ffffff",
  };

  const buttonSecondaryStyles = {
    backgroundColor: "#6c757d",
    borderColor: "#6c757d",
    color: "#ffffff",
  };

  if (!currentUser) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <h3>Please log in to view your profile</h3>
          <a href="/login" className="btn btn-primary">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={profileStyles}>
      {/* Success/Error Alerts */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show m-3"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {success && (
        <div
          className="alert alert-success alert-dismissible fade show m-3"
          role="alert"
        >
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div
          className="position-fixed top-0 start-0 w-100"
          style={{ zIndex: 9999 }}
        >
          <div className="progress" style={{ height: "4px" }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div style={headerStyles} className="position-relative">
        {userProfile.cover_image && (
          <img
            src={userProfile.cover_image} // Add server URL
            alt="Cover"
            className="w-100 h-100 position-absolute"
            style={{ objectFit: "cover", opacity: 0.7 }}
            onError={(e) => {
              console.error(
                "Cover image failed to load:",
                userProfile.cover_image
              );
              e.target.style.display = "none";
            }}
          />
        )}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-end h-100 py-5">
            <div className="col-12">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end">
                <div className="position-relative mb-3 mb-md-0">
                  <img
                    src={userProfile.avatar || "/default-avatar.png"}
                    alt="Profile"
                    className="rounded-circle border border-4 border-white"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.onerror = null; // prevent re-loop
                        e.target.src = "/default-avatar.png"; // must be placed in public/
                        e.target.dataset.fallback = "true";
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm position-absolute bottom-0 end-0 rounded-circle"
                    style={buttonPrimaryStyles}
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <i className="fas fa-camera"></i>
                    )}
                  </button>
                </div>
                <div className="ms-md-4 text-center text-md-start">
                  <h1 className="mb-1 fw-bold">{userProfile.name}</h1>
                  <p className="mb-2 text-light">@{userProfile.username}</p>
                  <p className="mb-0 text-light">{userProfile.bio}</p>
                  {userProfile.location && (
                    <p className="mb-0 text-light">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {userProfile.location}
                    </p>
                  )}
                </div>
                <div className="ms-auto mt-3 mt-md-0">
                  <button
                    className="btn me-2"
                    style={buttonSecondaryStyles}
                    onClick={() => coverInputRef.current?.click()}
                    disabled={loading}
                  >
                    <i className="fas fa-image me-2"></i>Change Cover
                  </button>
                  <button
                    className="btn me-2"
                    style={buttonSecondaryStyles}
                    onClick={openEditProfile}
                  >
                    <i className="fas fa-edit me-2"></i>Edit Profile
                  </button>
                  <button
                    className="btn"
                    style={buttonPrimaryStyles}
                    onClick={() => setShowUploadModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>Upload NFT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container py-4">
        <div className="row">
          <div className="col-md-3 col-6 mb-3">
            <div className="text-center p-3" style={cardStyles}>
              <h3 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>
                {nfts.length}
              </h3>
              <p className="mb-0 text-muted">NFTs Created</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="text-center p-3" style={cardStyles}>
              <h3 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>
                {nfts
                  .reduce((total, nft) => total + parseFloat(nft.price || 0), 0)
                  .toFixed(2)}
              </h3>
              <p className="mb-0 text-muted">ETH Listed</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="text-center p-3" style={cardStyles}>
              <h3 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>
                {nfts.filter((nft) => nft.status === "Sold").length}
              </h3>
              <p className="mb-0 text-muted">NFTs Sold</p>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="text-center p-3" style={cardStyles}>
              <h3 className="mb-1 fw-bold" style={{ color: "#2c3e50" }}>
                {nfts.filter((nft) => nft.status === "Listed").length}
              </h3>
              <p className="mb-0 text-muted">Active Listings</p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="container pb-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold" style={{ color: "#2c3e50" }}>
                My NFT Collection
              </h2>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className="btn btn-outline-secondary active"
                >
                  All
                </button>
                <button type="button" className="btn btn-outline-secondary">
                  Listed
                </button>
                <button type="button" className="btn btn-outline-secondary">
                  Sold
                </button>
              </div>
            </div>

            <div className="row">
              {nfts.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <i className="fas fa-images fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No NFTs yet</h4>
                  <p className="text-muted">
                    Upload your first NFT to get started!
                  </p>
                  <button
                    className="btn"
                    style={buttonPrimaryStyles}
                    onClick={() => setShowUploadModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>Upload NFT
                  </button>
                </div>
              ) : (
                nfts.map((nft) => (
                  <div
                    key={nft.id}
                    className="col-lg-3 col-md-4 border col-sm-6 mb-4"
                  >
                    <div className="card h-100" style={cardStyles}>
                      <img
                        src={nft.image_url} // Note: it's image_url from database
                        className="card-img-top"
                        alt={nft.title}
                        style={{ height: "250px", objectFit: "cover" }}
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.onerror = null; // prevent re-loop
                            e.target.src = "/default-avatar.png"; // must be placed in public/
                            e.target.dataset.fallback = "true";
                          }
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5
                          className="card-title fw-bold"
                          style={{ color: "#2c3e50" }}
                        >
                          {nft.title}
                        </h5>
                        {nft.description && (
                          <p className="card-text text-muted small">
                            {nft.description.length > 100
                              ? nft.description.substring(0, 100) + "..."
                              : nft.description}
                          </p>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span
                            className="fw-bold"
                            style={{ color: "#8b4513" }}
                          >
                            {nft.price} ETH
                          </span>
                          <span
                            className={`badge ${
                              nft.status === "Listed"
                                ? "bg-success"
                                : nft.status === "Sold"
                                ? "bg-primary"
                                : "bg-secondary"
                            }`}
                          >
                            {nft.status}
                          </span>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            <i className="fas fa-tag me-1"></i>
                            {nft.category}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={cardStyles}>
              <div className="modal-header border-bottom">
                <h5
                  className="modal-title fw-bold"
                  style={{ color: "#2c3e50" }}
                >
                  Edit Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditProfileModal(false)}
                ></button>
              </div>
              <form onSubmit={handleProfileUpdate}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Display Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProfile.name || ""}
                          onChange={(e) =>
                            setEditProfile((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProfile.username || ""}
                          onChange={(e) =>
                            setEditProfile((prev) => ({
                              ...prev,
                              username: e.target.value,
                            }))
                          }
                          disabled={loading}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Location
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProfile.location || ""}
                          onChange={(e) =>
                            setEditProfile((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          disabled={loading}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Website
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={editProfile.website || ""}
                          onChange={(e) =>
                            setEditProfile((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          disabled={loading}
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Twitter
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProfile.twitter || ""}
                          onChange={(e) =>
                            setEditProfile((prev) => ({
                              ...prev,
                              twitter: e.target.value,
                            }))
                          }
                          disabled={loading}
                          placeholder="@username"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Instagram
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editProfile.instagram || ""}
                          onChange={(e) =>
                            setEditProfile((prev) => ({
                              ...prev,
                              instagram: e.target.value,
                            }))
                          }
                          disabled={loading}
                          placeholder="@username"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Bio</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editProfile.bio || ""}
                      onChange={(e) =>
                        setEditProfile((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      disabled={loading}
                      maxLength={200}
                      placeholder="Tell us about yourself..."
                    ></textarea>
                    <small className="text-muted">
                      {(editProfile.bio || "").length}/200 characters
                    </small>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn"
                    style={buttonSecondaryStyles}
                    onClick={() => setShowEditProfileModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={buttonPrimaryStyles}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload NFT Modal */}
      {showUploadModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={cardStyles}>
              <div className="modal-header border-bottom">
                <h5
                  className="modal-title fw-bold"
                  style={{ color: "#2c3e50" }}
                >
                  Upload New NFT
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUploadModal(false)}
                  disabled={loading}
                ></button>
              </div>
              <form onSubmit={handleNftUpload}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          NFT Image *
                        </label>
                        <div
                          className="border border-2 border-dashed rounded p-4 text-center"
                          style={{ minHeight: "200px", cursor: "pointer" }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {newNft.imagePreview ? (
                            <img
                              src={newNft.imagePreview}
                              alt="Preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: "180px" }}
                            />
                          ) : (
                            <div className="text-muted">
                              <i className="fas fa-cloud-upload-alt fa-3x mb-3"></i>
                              <p>Click to upload image</p>
                              <small>Max size: 10MB | JPG, PNG, GIF</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Title *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={newNft.title}
                          onChange={(e) =>
                            setNewNft((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          required
                          disabled={loading}
                          placeholder="Enter NFT title"
                          maxLength={100}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Price (ETH) *
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          className="form-control"
                          value={newNft.price}
                          onChange={(e) =>
                            setNewNft((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          required
                          disabled={loading}
                          placeholder="0.000"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Category
                        </label>
                        <select
                          className="form-select"
                          value={newNft.category}
                          onChange={(e) =>
                            setNewNft((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          disabled={loading}
                        >
                          <option value="Art">Art</option>
                          <option value="Photography">Photography</option>
                          <option value="Music">Music</option>
                          <option value="Video">Video</option>
                          <option value="3D">3D</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Collectibles">Collectibles</option>
                          <option value="Sports">Sports</option>
                          <option value="Utility">Utility</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={newNft.description}
                      onChange={(e) =>
                        setNewNft((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your NFT, its story, and what makes it unique..."
                      disabled={loading}
                      maxLength={1000}
                    ></textarea>
                    <small className="text-muted">
                      {newNft.description.length}/1000 characters
                    </small>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">Uploading...</small>
                        <small className="text-muted">{uploadProgress}%</small>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn"
                    style={buttonSecondaryStyles}
                    onClick={() => setShowUploadModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={buttonPrimaryStyles}
                    disabled={
                      !newNft.title || !newNft.image || !newNft.price || loading
                    }
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload me-2"></i>Upload NFT
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleNftImageSelect}
        accept="image/*"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={avatarInputRef}
        onChange={(e) => handleImageUpload(e, "avatar")}
        accept="image/*"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={coverInputRef}
        onChange={(e) => handleImageUpload(e, "cover")}
        accept="image/*"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default ProfilePage;
