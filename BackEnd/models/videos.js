const mongoose = require("mongoose");

const qualitySchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    enum: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p', 'original']
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  bitrate: Number,
  codec: String,
  filesize: Number // in bytes
}, { _id: false });

const videoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ""
  },
  thumbnailUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  videoUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  qualities: {
    type: [qualitySchema],
    validate: {
      validator: function(v) {
        // At least one quality must match the main videoUrl if provided
        return v.length === 0 || v.some(q => q.url === this.videoUrl);
      },
      message: 'At least one quality must match the main videoUrl'
    }
  },
  duration: {
    type: Number, // in seconds
    min: 1
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Maximum 10 tags allowed'
    }
  },
  category: {
    type: String,
    enum: ['education', 'entertainment', 'news', 'tutorial', 'other'],
    default: 'other'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Indexes for better query performance
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ views: -1 });
videoSchema.index({ createdAt: -1 });

// Virtual for formatted duration (e.g., "5:30")
videoSchema.virtual('durationFormatted').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

// Middleware to ensure at least one quality matches main videoUrl
videoSchema.pre('save', function(next) {
  if (this.qualities && this.qualities.length > 0 && 
      !this.qualities.some(q => q.url === this.videoUrl)) {
    this.qualities.push({
      quality: 'original',
      url: this.videoUrl
    });
  }
  next();
});

const Video = mongoose.model("Video", videoSchema, "video");

module.exports = Video;