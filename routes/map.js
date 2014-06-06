var express = require ('express');
var router = express.Router();

/* GET map */
router.get('/', function(req, res) {
  res.render('map', { title: 'resegup', lat: 45.85417259484529, lon: 9.388961847871542 });
});

module.exports = router;
