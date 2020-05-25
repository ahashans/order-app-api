const express = require('express')
const Group = require('../models/group')
const router = new express.Router()
const auth = require('../middlewares/auth')
const {serializeError} = require('serialize-error')

router.use('/groups', auth)


router.get('/groups', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'groups',
            populate: [
                {
                    path: 'creator',
                },
                {
                    path: 'participants',
                }
            ]
        }).execPopulate()
        if (req.user.groups.length > 0)
            return res.send(req.user.groups)
        return res.status(404).send()
    } catch (e) {
        console.log(e)
        res.status(500).send(serializeError(e))
    }
})
router.get('/groups/all', async (req, res) => {
    try {
        const groups = await Group.find().populate('creator').populate('participants')
        if (!groups) {
            return res.status(404).send()
        }
        res.send(groups)
    } catch (e) {
        res.status(500).send(serializeError(e))
    }
})
router.post('/groups', auth, async (req, res) => {
    const group = new Group({
        ...req.body,
        creator: req.user._id,
        participants: [...req.body.participants, req.user._id]
    })
    try {
        await group.save()
        await group.populate([
            {
                path: 'creator',
            },
            {
                path: 'participants',
            }
        ]).execPopulate()
        res.status(201).send(group)
    } catch (e) {
        res.status(400).send(serializeError(e))
    }
})
router.patch('/groups/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'participants']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        const group = await Group.findById(req.params.id)
        if (!group) {
            return res.status(404).send({error: 'Group Not Found'})
        }
        updates.forEach(update => group[update] = req.body[update])
        await group.save()
        if (!group) {
            return res.status(404).send()
        }

        res.send(group)
    } catch (e) {
        console.log(e)
        res.status(400).send(serializeError(e))
    }
})

router.delete('/groups/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id)
        if (!group) {
            return res.status(404).send({error: "Group Not Found"})
        }
        await group.save()
        return res.send(group)
    } catch (e) {
        res.status(500).send(serializeError(e))
    }
})

module.exports = router