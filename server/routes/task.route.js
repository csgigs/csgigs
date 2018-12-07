const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const task_controller = require('../controllers/task.controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/addTask',task_controller.create_tasks)
router.post('/getTasksByGigs/:gigname', task_controller.get_tasks_gigs);
router.post('/updateTask/:taskid', task_controller.update_task);
router.post('/removeTask/:taskid', task_controller.remove_task);
router.post('/updateTasksPoints', task_controller.update_points_allocation);
router.put('/addUser/:task_id/:user_name', task_controller.task_add_user);
module.exports = router;
