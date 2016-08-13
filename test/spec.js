const assert = require('assert')
const tritonus = require('../index')

describe('transpose', function() {
    it('should work', function() {
        assert.deepEqual(
            tritonus.transpose(2, [0, 1, 2, 3, 4, 5, 6, 7, 8]),
            [2, 3, 4, 5, 6, 7, 8, 9, 10]
        )
    })
})
