const UserController = require('../controllers/users.controller');
const PostController = require('../controllers/posts.controller');
const MessageController = require('../controllers/messages.controller');
const PlaceController = require('../controllers/places.controller');
const AdminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/verifyJWT');
const multer = require('multer');
const { adminCheck } = require('../middlewares/adminCheck');
const formdataParser = multer({ dest: 'uploads/' });

module.exports = function (app) {
    //User routes
    app.post('/api/user/register', UserController.register);
    app.post('/api/user/login', UserController.login);
    app.post('/api/user/logout', authenticate, UserController.logout);
    app.get('/api/user', UserController.getAllUsers);
    app.get('/api/user/:id', UserController.getUser);
    app.put('/api/user/:id', authenticate, UserController.updateUser);
    app.delete('/api/user/:id', authenticate, UserController.deleteUser);
    app.get('/api/auth', authenticate, UserController.getLoggedUser);

    //Post Routes
    app.post(
        '/api/post/new',
        authenticate,
        formdataParser.single('photo'),
        PostController.createPost
    );
    app.get('/api/post/', PostController.getAllPosts);
    app.get('/api/post/:id', PostController.getPost);
    app.put(
        '/api/post/:id',
        formdataParser.single('photo'),
        authenticate,
        PostController.updatePost
    );
    app.delete('/api/post/:id', authenticate, PostController.deletePost);

    //Message Routes
    app.post(
        '/api/message/new',
        formdataParser.none(),
        authenticate,
        MessageController.createNewGroup
    );
    app.get(
        '/api/message/self',
        authenticate,
        MessageController.getMessageGroups
    );
    app.get(
        '/api/message/:groupId',
        authenticate,
        MessageController.getGroupMessages
    );

    //Google Places API
    app.get(
        '/api/place/search',
        authenticate,
        PlaceController.getAutocompleteResult
    );

    //Admin
    app.get(
        '/api/admin/collection',
        authenticate,
        adminCheck,
        AdminController.getCollections
    );
    app.get(
        '/api/admin/collection/:modelName',
        authenticate,
        adminCheck,
        AdminController.getOneCollection
    );
    app.get(
        '/api/admin/collection/:modelName/:docId',
        authenticate,
        adminCheck,
        AdminController.getOneDocument
    );
    app.delete(
        '/api/admin/collection/:modelName/:docId',
        authenticate,
        adminCheck,
        AdminController.deleteOneDocument
    );
};
