const express = require('express');
const Joi = require('joi');
const debug = require('debug')('videos');
const _ = require('lodash');

const router = express.Router();

const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Horror' },
  { id: 3, name: 'Romance' },
];

router.param('id', (req, res, next, id) => {
  const video = genres.find(vid => vid.id === parseInt(id, 10));
  debug(`Requesting video ID ${id}`);
  req.video = video;

  if (!req.video) {
    return res.status(404).send('Video Not found');
  }
  next();
});

function validateGenre(video) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(video, schema);
}

function getGenres(req, res) {
  res.send(genres);
}

function getGenre(req, res) {
  res.send(req.video);
}

function createGenre(req, res) {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  return res.send(genre);
}

function updateGenre(req, res) {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let updatedGenre = _.pick(req.body, ['name']);
  const index = genres.findIndex(v => v.id === req.video.id);
  updatedGenre = _.assign(genres[index], updatedGenre);

  return res.send(updatedGenre);
}

function deleteGenre(req, res) {
  const index = genres.findIndex(v => v.id === req.video.id);
  genres.splice(index, 1);
  return res.send(req.video);
}


router.get('/', getGenres);
router.post('/', createGenre);
router.get('/:id', getGenre);
router.put('/:id', updateGenre);
router.delete('/:id', deleteGenre);


module.exports = router;
