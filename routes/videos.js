const express = require('express');
const Joi = require('joi');
const debug = require('debug')('videos');
const _ = require('lodash');

const router = express.Router();

const videos = [{ id: 1, name: 'video1' }];

router.param('id', (req, res, next, id) => {
  const video = videos.find(vid => vid.id === parseInt(id, 10));
  debug(`Requesting video ID ${id}`);
  req.video = video;

  if (!req.video) {
    return res.status(404).send('Video Not found');
  }
  next();
});

function validateVideo(video) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(video, schema);
}

function getVideos(req, res) {
  res.send(videos);
}

function getVideo(req, res) {
  res.send(req.video);
}

function createVideo(req, res) {
  const { error } = validateVideo(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const video = {
    id: videos.length + 1,
    name: req.body.name,
  };

  videos.push(video);
  return res.send(video);
}

function updateVideo(req, res) {
  const { error } = validateVideo(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let updatedVideo = _.pick(req.body, ['name']);
  const index = videos.findIndex(v => v.id === req.video.id);
  updatedVideo = _.assign(videos[index], updatedVideo);

  return res.send(updatedVideo);
}

function deleteVideo(req, res) {
  const index = videos.findIndex(v => v.id === req.video.id);
  videos.splice(index, 1);
  return res.send(req.video);
}


router.get('/', getVideos);
router.post('/', createVideo);
router.get('/:id', getVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);


module.exports = router;
