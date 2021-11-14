var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: process.env.ELASTICSEARCH_URL,
    log: 'trace',
    // log : [{
    //     type: 'stdio',
    //     levels: ['error'] // change these options
    // }],
    apiVersion: '7.4', // use the same version of your Elasticsearch instance
});

router.put("/query", function(req, res) {
    client.search({
        index: 'shoppes.items',
        "body": {
            "_source": [],
            "size": 0,
            "min_score": 0.5,
            "query": {
                "bool": {
                    "must": [
                        {
                            "wildcard": {
                                "main.title": {
                                    "value": req.body.query
                                }
                            }
                        }
                    ],
                    "filter": [],
                    "should": [],
                    "must_not": []
                }
            },
            "aggs": {
                "auto_complete": {
                    "terms": {
                        "field": "main.title.keyword",
                        "order": {
                            "_count": "desc"
                        },
                        "size": 25
                    }
                }
            }
        }
        
    }).then(function(resp) {
        if (resp.aggregations.auto_complete.buckets.length > 0) {
            return res.json(resp.aggregations.auto_complete.buckets)
        } else {
            res.send("")
        }
        
    });
    
})

module.exports = router;

