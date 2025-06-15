const Video = require("../models/video");

async function GetVideoContent(req, res) {
  try {
    // Add query parameters for filtering
    const { category, search, sort = '-createdAt', limit = 10 } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const videos = await Video.find(query)
      .sort(sort)
      .limit(Number(limit))
      .select('-__v -_id'); // Exclude unnecessary fields

    // Add formatted duration to each video
    const videosWithFormattedDuration = videos.map(video => ({
      ...video.toObject(),
      durationFormatted: video.durationFormatted
    }));

    res.json({
      success: true,
      count: videos.length,
      data: videosWithFormattedDuration
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function UploadVideoContent(req, res) {
  try {
    const { 
      id, 
      title, 
      description = "", 
      thumbnailUrl, 
      videoUrl, 
      qualities = [], 
      duration, 
      tags = [], 
      category = 'other', 
      isPublic = true,
      owner 
    } = req.body;
    
    // Validate required fields
    if (!id || !title || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (id, title, videoUrl, or thumbnailUrl)"
      });
    }

    // Validate duration is in seconds if provided
    if (duration && (isNaN(duration) || duration <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Duration must be a positive number (in seconds)"
      });
    }

    // Check if video with same ID already exists
    const existingVideo = await Video.findOne({ id });
    if (existingVideo) {
      return res.status(409).json({
        success: false,
        message: "Video with this ID already exists"
      });
    }

    // Process video qualities
    const processedQualities = qualities.map(q => ({
      quality: q.quality || 'original',
      url: q.url || videoUrl,
      bitrate: q.bitrate || null,
      codec: q.codec || null,
      filesize: q.filesize || null
    }));

    // Ensure at least one quality matches the main videoUrl
    if (!processedQualities.some(q => q.url === videoUrl)) {
      processedQualities.push({
        quality: 'original',
        url: videoUrl
      });
    }

    // Create video document
    const video = await Video.create({
      id,
      title,
      description,
      thumbnailUrl,
      videoUrl,
      qualities: processedQualities,
      duration,
      tags,
      category,
      isPublic,
      owner
    });

    return res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: {
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        videoUrl: video.videoUrl,
        qualities: video.qualities,
        duration: video.duration,
        durationFormatted: video.durationFormatted,
        views: video.views,
        isPublic: video.isPublic,
        tags: video.tags,
        category: video.category,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt
      }
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = {
  GetVideoContent,
  UploadVideoContent,
};