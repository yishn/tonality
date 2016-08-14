const assert = require('assert')
const helper = require('../helper')

describe('helper', function() {
    describe('shift', function() {
        it('should not mutate array', function() {
            let a = [0, 1, 2, 3, 4]
            let b = helper.shift(a, 0)

            assert.deepEqual(a, b)
            assert.notEqual(a, b)
        })
        it('shifts head of an array to the end', function() {
            assert.deepEqual(helper.shift([0, 1, 2, 3, 4], 2), [2, 3, 4, 0, 1])
        })
        it('shifts tail of an array to the start', function() {
            assert.deepEqual(helper.shift([0, 1, 2, 3, 4], -2), [3, 4, 0, 1, 2])
        })
    })
})
