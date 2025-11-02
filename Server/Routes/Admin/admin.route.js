const express = require('express');
const {GetAdminStats} = require('../../Controllers/Admin/stats.controller')
const router = express.Router();

router.get("/admin/user-stats", GetAdminStats );