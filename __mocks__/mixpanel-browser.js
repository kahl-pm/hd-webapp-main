module.exports = {
    people: {
        set: jest.fn(),
        set_once: jest.fn(),
        increment: jest.fn(),
        append: jest.fn(),
        unset: jest.fn()
    },
    identify: jest.fn(),
    get_distinct_id: ()=>'distinctID',
    track: jest.fn(),
    opt_out_tracking: jest.fn(),
    opt_in_tracking: jest.fn(),
    has_opted_out_tracking: jest.fn()
}