const express = require('express');
const router = express.Router();
const gig_controller = require('../controllers/gig.controller');

router.get('/:id/getUserAdmins', gig_controller.get_user_admins); //gig id
router.put('/:id/addUserAdmin', gig_controller.add_user_admin);
router.post('/:id/deleteUserAdmin', gig_controller.delete_user_admin);

router.get('/:id/getUserParticipants', gig_controller.get_user_participants);
router.put('/:id/addUserParticipant', gig_controller.add_user_participant);
router.post('/:id/deleteUserParticipant', gig_controller.delete_user_participant);

router.post('/create', gig_controller.create_gig);
router.get('/get_name_by_id/:id', gig_controller.get_gig_name);
router.get('/:user_id', gig_controller.get_user_all_gigs);
router.get('/:user_id/:id', gig_controller.get_gig_by_id);

router.post('/getGigsByStatus/:status', gig_controller.gigs_by_status);

module.exports = router;
