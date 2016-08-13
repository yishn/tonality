const assert = require('assert')
const tt = require('../index')

describe('isValid', function() {
    it('should accept whole notes', function() {
        let scale = tt([0, 1, 2, -5, -4])
        assert(scale.isValid())
    })
    it('should accept semi-notes', function() {
        let scale = tt([0, 0.5, -1.5, -2, 5.5])
        assert(scale.isValid())
    })
    it('should detect rubbish entries', function() {
        let scale = tt(['blah', 1, 2])
        assert(!scale.isValid())
    })
    it('should detect non semi-notes', function() {
        let scale = tt([0, 0.3, 0.6, 1])
        assert(!scale.isValid())
    })
})

describe('transpose', function() {
    it('should work', function() {
        let scale = tt([0, 1, 2, 3, 4, 5, 6, 7, 8])

        assert(tt.equals(
            scale.transpose(2),
            tt([2, 3, 4, 5, 6, 7, 8, 9, 10])
        ))
    })
})
