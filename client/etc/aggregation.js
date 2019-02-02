[
  {
    '$match': {
      '_id': new ObjectId('5c52014090770a49a0d7c75f')
    }
  }, {
    '$redact': {
      '$cond': {
        'if': {
          '$ne': [
            '$status', 'Rejected'
          ]
        },
        'then': '$$DESCEND',
        'else': '$$PRUNE'
      }
    }
  }
]
