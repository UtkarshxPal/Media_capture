import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BASE_URL = "https://media-capture-hg6m.onrender.com";
// const BASE_URL = "http://localhost:5000";

const Dashboard = () => {
  const { user, logout } = useAuth();

  //  media handling
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchMedia();
  }, [activeFilter]);

  const fetchMedia = async () => {
    try {
      let url = `${BASE_URL}/api/media`;
      if (activeFilter !== "all") {
        url = `${BASE_URL}/api/media/type/${activeFilter}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMedia(response.data);
    } catch (err) {
      setError("Failed to fetch media");
    }
  };

  // Handle file selection from input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Handle file upload submission
  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!file) {
      setError("Please select a file");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);
    formData.append("title", file.name);

    try {
      await axios.post(`${BASE_URL}/api/media/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccess("File uploaded successfully");
      setFile(null);
      setDescription("");
      fetchMedia();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    }
    setLoading(false);
  };

  // Handle media deletion
  const handleDelete = async (mediaId) => {
    try {
      await axios.delete(`${BASE_URL}/api/media/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccess("Media deleted successfully");
      fetchMedia();
    } catch (err) {
      setError("Failed to delete media");
    }
  };

  // Handle media preview
  const handlePreview = (media) => {
    setSelectedMedia(media);
    setShowPreview(true);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between mb-2">
            <h3>Welcome, {user.username}</h3>
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          </div>
          <Card className="p-4">
            <h3 className="mb-4">Upload Media</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleUpload}>
              <Form.Group className="mb-3">
                <Form.Label>File</Form.Label>
                <div className="custom-file-input">
                  <Button
                    variant="outline-primary"
                    onClick={() => document.getElementById("fileInput").click()}
                    className="w-100"
                  >
                    Choose File
                  </Button>
                  <Form.Control
                    id="fileInput"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="d-none"
                  />

                  {file && (
                    <div className="selected-file mt-2">
                      Selected: {file.name}
                    </div>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-100"
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="mb-4">Your Media</h3>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Your Media</h3>
            <div
              className="btn-group"
              role="group"
              aria-label="Media type filter"
            >
              <input
                type="radio"
                className="btn-check"
                name="mediaFilter"
                id="allMedia"
                checked={activeFilter === "all"}
                onChange={() => setActiveFilter("all")}
                autoComplete="off"
              />
              <label className="btn btn-outline-primary" htmlFor="allMedia">
                All
              </label>

              <input
                type="radio"
                className="btn-check"
                name="mediaFilter"
                id="imageMedia"
                checked={activeFilter === "image"}
                onChange={() => setActiveFilter("image")}
                autoComplete="off"
              />
              <label className="btn btn-outline-primary" htmlFor="imageMedia">
                Images
              </label>

              <input
                type="radio"
                className="btn-check"
                name="mediaFilter"
                id="videoMedia"
                checked={activeFilter === "video"}
                onChange={() => setActiveFilter("video")}
                autoComplete="off"
              />
              <label className="btn btn-outline-primary" htmlFor="videoMedia">
                Videos
              </label>
            </div>
          </div>
          <div className="media-grid">
            {media.length > 0 ? (
              media.map((item) => (
                <Card key={item._id} className="media-card">
                  <div
                    className="media-preview"
                    onClick={() => handlePreview(item)}
                  >
                    {item.fileType === "image" ? (
                      <img
                        src={`${BASE_URL}/${item.filePath}`}
                        alt={item.title}
                        className="preview-image"
                      />
                    ) : (
                      <video
                        src={`${BASE_URL}/${item.filePath}`}
                        className="preview-video"
                      />
                    )}
                  </div>

                  <Card.Body>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <div className="btn-group">
                      <Button
                        variant="outline-primary"
                        onClick={() => handlePreview(item)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <Card
                className="w-100 text-center"
                style={{ minHeight: "200px" }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                  <h4 className="text-muted mb-3">No media found</h4>
                  {activeFilter !== "all" ? (
                    <p className="text-muted">
                      No {activeFilter}s available. Try uploading some or change
                      the filter.
                    </p>
                  ) : (
                    <p className="text-muted">
                      Start by uploading some media using the form above.
                    </p>
                  )}
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedMedia?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedia?.fileType === "image" ? (
            <img
              src={`${BASE_URL}/${selectedMedia?.filePath}`}
              alt={selectedMedia?.title}
              style={{ width: "100%" }}
            />
          ) : (
            <video
              src={`${BASE_URL}/${selectedMedia?.filePath}`}
              controls
              style={{ width: "100%" }}
            />
          )}
          <p className="mt-3">{selectedMedia?.description}</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;
