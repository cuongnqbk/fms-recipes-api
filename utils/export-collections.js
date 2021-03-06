const path = require('path')
const fs = require('fs')
const assert = require('assert')
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

require('../models/')

const config = require('../config/config.js')
const collectionsDb = require('../helpers/db/collections')

const done = (cb) => {
    mongoose.disconnect( () => {
        console.log('')
        console.log('disconnected from mongo')
        if (cb) cb()
    })
}

const writeCollectionToFile = (collection, last) => {
    let fileout = `${config.externalBaseUrl}/collections/${collection.slug}.json`
    fileout = path.resolve(__dirname, fileout)
    fs.writeFile(fileout, JSON.stringify(collection, null, 2), (err) => {
        if (err) {
            done(console.log(err))
            throw err
        }
        console.log(collection.slug, 'written to:', fileout)
        if (last) done(console.log('done writing files.'))
    })
}

const writeCollectionIndex = collections => {
    let fileout = `${config.externalBaseUrl}/collections/index.json`
    fileout = path.resolve(__dirname, fileout)
    fs.writeFile(fileout, JSON.stringify({ collections }, null, 2), (err) => {
        if (err) {
            throw new Error(err)
        }
    })
}

const exportCollections = collections => {
    writeCollectionIndex(collections)

    collections.forEach((collection, index) => {
        const last = index === collections.length -1
        collectionsDb.getCollectionById(collection._id)
            .then(collection => {
                writeCollectionToFile(collection, last)
            })
            .catch(err => {
                done(console.error(err))
            })
    })
}

mongoose.connect(config.dbHost + config.devDb, (err) => {
    assert.equal(null, err)
    console.log('connected to', mongoose.connection.db.databaseName)
    collectionsDb.getCollections()
        .then(docs => {
            exportCollections(docs)
        })
        .catch(err => {
            done(console.error(err))
        })
})
