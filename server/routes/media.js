// Import required dependencies
const router = require("express").Router();
const multer = require("multer");  
const path = require("path");      
const fs = require("fs");          
const auth = require("../middleware/auth");  
const Media = require("../models/Media");    

// Configure multer storage settings
const storage = multer.diskStorage({
 
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true); 
  } else {
    
    cb(
      new Error("Invalid file type. Only images and videos are allowed."),
      false
    );
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

  
    const savedMedia = await Media.create({
      title: req.body.title || req.file.originalname,
      fileType: req.file.mimetype.startsWith("image/") ? "image" : "video",
      filePath: req.file.path,
      user: req.user,
    });
    res.json(savedMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's media
router.get("/", auth, async (req, res) => {
  try {
    const media = await Media.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete media
router.delete("/:id", auth, async (req, res) => {
  try {
   
    const media = await Media.findOne({ _id: req.params.id, user: req.user });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Delete the physical file from the uploads directory
    fs.unlink(media.filePath, async (err) => {
      if (err) {
        console.error("File deletion error:", err);
      }
      // Delete the media document from the database
      await Media.deleteOne({ _id: media._id });
      res.json({ message: "Media deleted successfully" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/type/:type", auth, async (req, res) => {
  try {
    // Find all media belonging to the authenticated user
    const media = await Media.find({
      user: req.user,
      fileType: req.params.type,
    }).sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
