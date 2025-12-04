import React, { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../services/supabase";

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
  const [userProfile, setUserProfile] = useState(null);
  const [editProfile, setEditProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [canUpload, setCanUpload] = useState(false); // Set to false to show payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Add this
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [withdrawalModal, setWithdrawalModal] = useState(false);
  // const openWithdrawalModal = ()=>setWithdralModal(true);
  const closeWithdrawModal = () => setWithdrawalModal(false);

  // Add withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    walletAddress: "",
    note: "",
  });
  // const [lastPaymentModal, setlastPaymentModa] = useState(false);

  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
      loadUserNfts();
    }
  }, [currentUser]);

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("admin_role")
        .eq("id", currentUser.id)
        .single();

      if (error) throw error;
      setIsAdmin(data?.admin_role || false);
    } catch (err) {
      console.error("Error checking admin role:", err);
      setIsAdmin(false);
    }
  };

  // started
  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    setWithdrawalModal(true);

    // if (!withdrawalForm.amount || !withdrawalForm.walletAddress) {
    //   setError("Please fill in all required fields");
    //   return;
    // }

    // const withdrawalAmount = parseFloat(withdrawalForm.amount);
    // const currentBalance = userProfile?.nft_balance || 0;

    // if (withdrawalAmount > currentBalance) {
    //   setError("Insufficient balance for withdrawal");
    //   return;
    // }

    // try {
    //   setLoading(true);

    //   const { data, error } = await supabase
    //     .from("withdrawal_requests")
    //     .insert([
    //       {
    //         user_id: currentUser.id,
    //         amount: withdrawalAmount,
    //         wallet_address: withdrawalForm.walletAddress,
    //         note: withdrawalForm.note,
    //         status: "pending",
    //         created_at: new Date().toISOString(),
    //       },
    //     ]);

    //   if (error) throw error;

    //   setSuccess("Withdrawal request submitted successfully!");
    //   setShowWithdrawalModal(false);
    //   setWithdrawalForm({ amount: "", walletAddress: "", note: "" });
    // } catch (err) {
    //   setError("Failed to submit withdrawal request.");
    // } finally {
    //   setLoading(false);
    // }
  };
  // ended

  // const loadUserProfile = async () => {
  //   try {
  //     console.log("Loading user profile for ID:", currentUser.id);

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", currentUser.id)
  //       .single();

  //     console.log("Profile data loaded:", data);
  //     console.log("Profile load error:", error);

  //     if (error) throw error;
  //     setUserProfile(data);
  //     // Set canUpload based on database value
  //     setCanUpload(data.can_upload || false);
  //     setIsAdmin(data.admin_role || false);
  //   } catch (err) {
  //     console.error("Error loading profile:", err);
  //     setError("Failed to load profile.");
  //   }
  // };
  const loadUserProfile = async () => {
    try {
      console.log("Loading user profile for ID:", currentUser.id);

      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();
        

      // If profile doesn't exist, create it
      if (error?.code === 'PGRST116') { // Not found error
        console.log("Profile not found, creating new one...");

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: currentUser.id,
              username: currentUser.email?.split('@')[0] || 'user',
              email: currentUser.email,
              name: currentUser.user_metadata?.name || '',
              bio: "",
              location: "",
              website: "",
              twitter: "",
              instagram: "",
              avatar: null,
              cover_image: null,
              nft_balance: 0,
              can_upload: false,
              admin_role: false,
            },
          ])
          .select()
          .single();

        if (createError) throw createError;
        data = newProfile;
      } else if (error) {
        throw error;
      }

      console.log("Profile data loaded:", data);
      setUserProfile(data);
      setCanUpload(data.can_upload || false);
      setIsAdmin(data.admin_role || false);
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile. Please refresh the page.");
    }
  };


  const loadUserNfts = async () => {
    try {
      const { data, error } = await supabase
        .from("nfts")
        .select("*")
        .eq("owner", currentUser.id);

      if (error) throw error;
      setNfts(data);
    } catch (err) {
      console.error("Error loading NFTs:", err);
      setError("Failed to load NFTs.");
    }
  };

  const uploadImageToStorage = async (file, path) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      console.log("Uploading to path:", `${path}/${fileName}`);

      const { data, error } = await supabase.storage
        .from("nftproject")
        .upload(`${path}/${fileName}`, file);

      console.log("Upload response:", { data, error });

      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("nftproject")
        .getPublicUrl(`${path}/${fileName}`);

      console.log("Public URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload function error:", error);
      throw error;
    }
  };

  const handleImageUpload = async (event, type = "avatar") => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/"))
      return setError("Invalid image file");
    if (file.size > 10 * 1024 * 1024) return setError("Max file size is 10MB");

    try {
      setLoading(true);
      setError(""); // Clear previous errors
      setSuccess(""); // Clear previous success messages

      console.log("Starting image upload for type:", type);
      console.log("Current user ID:", currentUser.id);

      const imageUrl = await uploadImageToStorage(file, type);
      console.log("Image uploaded successfully, URL:", imageUrl);

      const fieldName = type === "cover" ? "cover_image" : "avatar";
      console.log("Updating profile field:", fieldName, "with URL:", imageUrl);

      const { data, error } = await supabase
        .from("profiles")
        .update({ [fieldName]: imageUrl })
        .eq("id", currentUser.id)
        .select(); // Add select to get the updated data back

      console.log("Profile update response:", { data, error });

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      // Update local state
      setUserProfile((prev) => ({ ...prev, [fieldName]: imageUrl }));
      console.log("Local state updated");

      setSuccess(
        `${type === "avatar" ? "Avatar" : "Cover image"} uploaded successfully`
      );

      // Force a reload of the profile to ensure we have the latest data
      await loadUserProfile();
    } catch (err) {
      console.error("Image upload error:", err);
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNftUpload = async (e) => {
    e.preventDefault();

    // Check if user can upload
    if (!canUpload) {
      setShowPaymentModal(true);
      return;
    }

    if (!newNft.title || !newNft.image || !newNft.price) {
      setError("Fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadImageToStorage(newNft.image, "nfts");
      const { data, error } = await supabase.from("nfts").insert([
        {
          title: newNft.title,
          description: newNft.description,
          price: newNft.price,
          category: newNft.category,
          image_url: imageUrl,
          owner: currentUser.id,
          owner_email: currentUser.email,
        },
      ]);
      console.log("NFT upload response:", { data, error });

      if (error) throw error;
      setNfts((prev) => [data[0], ...prev]);
      setNewNft({
        title: "",
        description: "",
        price: "",
        image: null,
        imagePreview: null,
        category: "Art",
      });
      setShowUploadModal(false);
      setSuccess("NFT uploaded!");
      await loadUserProfile();
    } catch (err) {
      console.error(err);
      setError("NFT upload failed");
    } finally {
      setLoading(false);
    }
  };

  // const handlePayment = () => {
  //   setCanUpload(false);
  //   setShowPaymentModal(false);
  //   setSuccess("Payment successful! You can now upload NFTs.");
  // };

  const handlePayment = () => {
    setShowPaymentModal(false);
    setError("Please contact admin to grant upload permission.");
  };

  const handleNftImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setError("Invalid image");
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update(editProfile)
        .eq("id", currentUser.id);

      if (error) throw error;
      setUserProfile((prev) => ({ ...prev, ...editProfile }));
      setShowEditProfileModal(false);
      setSuccess("Profile updated");
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const openEditProfile = () => {
    setEditProfile({ ...userProfile });
    setShowEditProfileModal(true);
  };
  // Styles
  


  const buttonSuccessStyles = {
  background: "rgba(40, 167, 69, 0.35)",  // transparent green
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  color: "#ffffff",
  borderRadius: "10px",
  transition: "all 0.3s ease",
};

const profileStyles = {
 background: `linear-gradient(135deg,
  #0f172a 0%,    
  #1e293b 30%,  
  #334155 65%,   
  #64748b 100%   
)`,
  backgroundSize: "300% 300%",
  animation: "gradientFlow 8s ease infinite",
  minHeight: "100vh",
  fontFamily: "Inter, serif",
};



const headerStyles = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  minHeight: "300px",
  color: "#ecf0f1",
  position: "relative",
  borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
};

const cardStyles = {
  background: "rgba(0, 0, 0, 0.35)",
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  borderRadius: "15px",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  color: "white",
  transition: "transform 0.2s ease-in-out",
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.25)",
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  borderRadius: "15px",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  color: "#fff",
  transition: "transform 0.2s ease-in-out",
};

const buttonPrimaryStyles = {
  background: "rgba(0, 0, 0, 0.35)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  color: "#ffffff",
  borderRadius: "10px",
  transition: "all 0.3s ease",
};

const buttonSecondaryStyles = {
  background: "rgba(108, 117, 125, 0.35)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.4)",
  color: "#ffffff",
  borderRadius: "10px",
  transition: "all 0.3s ease",
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

  if (!userProfile) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mt-3">Loading profile...</h3>
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
            crossOrigin="true"
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
        <div className="profile-container position-relative" style={{ zIndex: 2 }}>
          <div className="profile-header">
            <div className="w-100">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3 gap-md-4">
                <div className="position-relative mb-3 mb-md-0">
                  <img
                    src={userProfile?.avatar || "/default-avatar.png"}
                    alt="Profile"
                    className="profile-avatar rounded-circle border border-4 border-white"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                    onLoad={() =>
                      console.log("Avatar image loaded successfully")
                    }
                    onError={(e) => {
                      console.error(
                        "Avatar failed to load:",
                        userProfile?.avatar
                      );
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
                  <h1 className="profile-title mb-1 fw-bold">{userProfile.name}</h1>
                  <p className="mb-2 text-light text-responsive-base">@{userProfile.username}</p>
                  {/* <span
                    className={`badge ms-2 ${
                      userProfile?.can_upload ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {userProfile?.can_upload ? "Granted" : "Denied"}
                  </span> */}
                  <p className="mb-0 text-light">{userProfile.bio}</p>
                  {userProfile.location && (
                    <p className="mb-0 text-light">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {userProfile.location}
                    </p>
                  )}
                </div>
                <div className="ms-auto mt-3 mt-md-0 d-flex flex-s-column flex-sm-row justify-content-sm-center align-items-sm-center gap-2  settings-buttons">
                  {isAdmin && (
                    <button
                      className="btn"
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                        color: "#ffffff",
                      }}
                      onClick={() => (window.location.href = "/admin/users")}
                      title="Admin Panel"
                    >
                      <i className="fas fa-user-shield me-2"></i>Admin Panel
                    </button>
                  )}
                  <button
                    className="btn btn-enhanced"
                    style={buttonSecondaryStyles}
                    onClick={() => coverInputRef.current?.click()}
                    disabled={loading}
                  >
                    <i className="fas fa-image me-2"></i>Change Cover
                  </button>
                  <button
                    className="btn btn-enhanced"
                    style={buttonSecondaryStyles}
                    onClick={openEditProfile}
                  >
                    <i className="fas fa-edit me-2"></i>Edit Profile
                  </button>
                  <button
                    className="btn btn-enhanced"
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
      <div className="profile-container stats-section ">
        <div className="stats-grid container">
          <div className="mb-3">
            <div className="card text-center p-3 h-100" style={cardStyles}>
              <h3
                className="mb-1 fw-bold text-responsive-lg"
                style={{ color: "white" }}
              >
                {nfts.length}
              </h3>
              <p className="mb-0 text-light text-responsive-sm">NFTs Created</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="card text-center p-3 h-100" style={cardStyles}>
              <h3
                className="mb-1 fw-bold text-responsive-lg"
                style={{ color: "white" }}
              >
                {nfts
                  .reduce((total, nft) => total + parseFloat(nft.price || 0), 0)
                  .toFixed(2)}
              </h3>
              <p className="mb-0 text-light text-responsive-sm">ETH Listed</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="card text-center p-3 h-100" style={cardStyles}>
              <h3
                className="mb-1 fw-bold text-responsive-lg"
                style={{ color: "white" }}
              >
                {nfts.filter((nft) => nft.status === "Sold").length}
              </h3>
              <p className="mb-0 text-light text-responsive-sm">NFTs Sold</p>
            </div>
          </div>
          <div className="mb-3">
            <div className="card text-center p-3 h-100" style={cardStyles}>
              <h3
                className="mb-1 fw-bold text-responsive-lg"
                style={{ color: "#28a745" }}
              >
                {(userProfile?.nft_balance || 0).toFixed(3)}
              </h3>
              <p className="mb-0 text-light text-responsive-sm">ETH Balance</p>
            </div>
          </div>
          {/* Withdrawal Button Card */}
          <div className="mb-3">
            <div className="card text-center p-3 h-100" style={cardStyles}>
              <button
                className="btn btn-enhanced btn-sm w-100"
                style={buttonSuccessStyles}
                onClick={() => setShowWithdrawalModal(true)}
                disabled={
                  !userProfile?.nft_balance || userProfile.nft_balance <= 0
                }
              >
                <i className="fas fa-wallet me-1"></i>
                Withdraw
              </button>
              <p
                className="mb-0 text-light mt-2 text-responsive-sm"
              >
                Available
              </p>
            </div>
          </div>
          {/* Active Listings Card */}
          <div className="mb-3">
            <div className="card text-center p-3 h-100" style={cardStyles}>
              <h3
                className="mb-1 fw-bold text-responsive-lg"
                style={{ color: "white" }}
              >
                {nfts.filter((nft) => nft.status === "Listed").length}
              </h3>
              <p className="mb-0 text-light text-responsive-sm">Active Listings</p>
            </div>
          </div>

          {/* Withdrawal Modal */}
          {showWithdrawalModal && (
            <div
              className="modal show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content" style={cardStyle}>
                  <div className="modal-header border-bottom">
                    <h5
                      className="modal-title fw-bold"
                      style={{ color: "#2c3e50" }}
                    >
                      <i className="fas fa-wallet me-2"></i>Withdraw ETH
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowWithdrawalModal(false)}
                    ></button>
                  </div>
                  <div>
                    <div className="modal-body">
                      <div className="alert alert-info">
                        <strong>Available Balance:</strong>{" "}
                        {(userProfile?.nft_balance || 0).toFixed(6)} ETH
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Withdrawal Amount (ETH) *
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          min="0.001"
                          max={userProfile?.nft_balance || 0}
                          className="form-control"
                          value={withdrawalForm.amount}
                          onChange={(e) =>
                            setWithdrawalForm((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Ethereum Wallet Address *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={withdrawalForm.walletAddress}
                          onChange={(e) =>
                            setWithdrawalForm((prev) => ({
                              ...prev,
                              walletAddress: e.target.value,
                            }))
                          }
                          required
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn"
                        style={buttonSecondaryStyles}
                        onClick={() => setShowWithdrawalModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={buttonSuccessStyles}
                        disabled={loading}
                        onClick={() => {
                          setWithdrawalModal(true); // Show success modal
                          setShowWithdrawalModal(false); // Close withdrawal form modal
                        }}
                      >
                        {loading ? "Processing..." : "Request Withdrawal"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NFT Collection */}
      <div className="profile-container pb-5">
        <div className="w-100">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
            <h2 className="fw-bold text-responsive-lg" style={{ color: "white" }}>
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

            <div className="nft-grid">
              {nfts.length === 0 ? (
                <div className="text-center py-5" style={{ gridColumn: "1 / -1" }}>
                  <i className="fas fa-images fa-3x text-muted mb-3"></i>
                  <h4 className="text-muted">No NFTs yet</h4>
                  <p className="text-muted">
                    Upload your first NFT to get started!
                  </p>
                  <button
                    className="btn btn-enhanced"
                    style={buttonPrimaryStyles}
                    onClick={() => setShowUploadModal(true)}
                  >
                    <i className="fas fa-plus me-2"></i>Upload NFT
                  </button>
                </div>
              ) : (
                nfts.map((nft) => (
                  <div key={nft.id} className="mb-4">
                    <div className="nft-card h-100" style={cardStyles}>
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
                          style={{ color: "white" }}
                        >
                          {nft.title}
                        </h5>
                        {nft.description && (
                          <p className="card-text small text-light">
                            {nft.description.length > 100
                              ? nft.description.substring(0, 100) + "..."
                              : nft.description}
                          </p>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <span className="fw-bold" style={{ color: "green" }}>
                            {nft.price} ETH
                          </span>
                          <span
                            className={`badge ${nft.status === "Listed"
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

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={cardStyle}>
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
            <div className="modal-content" style={cardStyle}>
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

      {/* Payment Modal */}
      {showPaymentModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={cardStyle}>
              <div className="modal-header border-bottom">
                <h5
                  className="modal-title fw-bold"
                  style={{ color: "#2c3e50" }}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Payment Required
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="alert alert-info" role="alert">
                  {/* <i className="fas fa-info-circle me-2"></i> */}
                  {/* <strong>Current NFT Balance:</strong>{" "} */}
                  {/* {userProfile?.nft_balance || 0} */}
                  {/* <br /> */}
                  <strong>Upload Permission:</strong>
                  <span
                    className={`badge ms-2 ${userProfile?.can_upload ? "bg-success" : "bg-danger"
                      }`}
                  >
                    {userProfile?.can_upload ? "Granted" : "Denied"}
                  </span>
                </div>

                <div className="mb-4">
                  <i className="fas fa-lock fa-3x text-warning mb-3"></i>
                  <h4 style={{ color: "#2c3e50" }}>Upload Restricted</h4>
                  <p className="text-muted mb-4">
                    Hello! You need to make a payment before you can upload your
                    NFT.
                  </p>

                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Premium Feature:</strong> NFT uploads require a
                    one-time payment of 0.1 ETH.
                  </div>

                  <div className="pricing-info mb-4">
                    <div className="card border">
                      <div className="card-body">
                        <h5 className="card-title text-dark">
                          <i className="fas fa-star me-2"></i>
                          NFT Upload Access
                        </h5>
                        <h3 className="text-success">0.1 ETH</h3>
                        <p className="card-text text-muted">
                          Unlimited NFT uploads for 30 days
                        </p>

                        {/* QR Code Payment Section */}
                        <div className="d-flex flex-column align-items-center mt-3 mb-3">
                          <div
                            className="p-3 bg-white rounded mb-3"
                            style={{ border: "1px solid #eee" }}
                          >
                            <QRCodeSVG
                              value={`ethereum:0x1f73AEbf099E65B8Af114602f014d0dB628e115F?value=100000000000000000`}
                              size={180}
                              level="H"
                              includeMargin={false}
                            />
                          </div>
                          <p className="text-muted small mb-2">
                            Scan to pay with any Ethereum wallet
                          </p>

                          {/* Address Copy Section */}
                          <div
                            className="input-group mt-2"
                            style={{ maxWidth: "300px" }}
                          >
                            <input
                              type="text"
                              className="form-control"
                              value="0x1f73AEbf099E65B8Af114602f014d0dB628e115F"
                              readOnly
                              style={{
                                fontSize: "0.8rem",
                                fontFamily: "monospace",
                                borderTopRightRadius: "0",
                                borderBottomRightRadius: "0",
                              }}
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  "0x1f73AEbf099E65B8Af114602f014d0dB628e115F"
                                );
                                // You might want to add a toast notification here
                              }}
                              style={{
                                borderTopLeftRadius: "0",
                                borderBottomLeftRadius: "0",
                              }}
                            >
                              <i className="fas fa-copy"></i>
                            </button>
                          </div>
                          <p className="text-muted small mt-2">
                            Or copy address to send manually
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top">
                <button
                  type="button"
                  className="btn"
                  style={buttonSecondaryStyles}
                  onClick={() => setShowPaymentModal(false)}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn"
                  style={buttonPrimaryStyles}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "0x1f73AEbf099E65B8Af114602f014d0dB628e115F"
                    );
                    // You might want to add a toast notification here
                  }}
                >
                  <i className="fas fa-copy me-2"></i>
                  Copy Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {withdrawalModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              <div className="modal-header border-bottom-0 pb-0">
                <h5
                  className="modal-title fw-bold"
                  style={{ color: "#2c3e50", fontSize: "1.25rem" }}
                >
                  Withdrawal Requirements
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setWithdrawalModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center px-4 py-4">
                <div className="alert alert-warning bg-soft-warning border-0 mb-4">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  Before withdrawal, you need to pay 20% of your ETH balance
                </div>
                <h3 className="text-success">
                  {((userProfile?.nft_balance || 0) * 0.2).toFixed(6)} ETH
                </h3>
                <div className="mb-4">
                  <p className="text-muted mb-3">
                    Scan this QR code to make payment
                  </p>
                  <div className="d-flex justify-content-center mb-3">
                    <div
                      className="p-3 bg-white rounded"
                      style={{
                        border: "1px solid #eee",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                      }}
                    >
                      <QRCodeSVG
                        value={`ethereum:0x1f73AEbf099E65B8Af114602f014d0dB628e115F?value=100000000000000000`}
                        size={180}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  <div
                    className="input-group mb-3"
                    style={{ maxWidth: "300px", margin: "0 auto" }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      value="0x1f73AEbf099E65B8Af114602f014d0dB628e115F"
                      readOnly
                      style={{
                        borderRight: "0",
                        backgroundColor: "#f8f9fa",
                        fontSize: "0.85rem",
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          "0x1f73AEbf099E65B8Af114602f014d0dB628e115F"
                        );
                        // You might want to add a toast notification here
                      }}
                      style={{
                        borderTopLeftRadius: "0",
                        borderBottomLeftRadius: "0",
                        borderColor: "#dee2e6",
                      }}
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                  <p className="text-muted small">ETH Network Only</p>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setWithdrawalModal(false)}
                  >
                    <i className="fas fa-times me-2"></i>Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setWithdrawalModal(false)}
                    style={{
                      background: "linear-gradient(135deg, #3a7bd5, #00d2ff)",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "8px",
                    }}
                  >
                    <i className="fas fa-check me-2"></i>I've Paid
                  </button>
                </div>
              </div>
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
