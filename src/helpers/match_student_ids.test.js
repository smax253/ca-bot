const matchStudentIds = require('./match_student_ids');
describe('HELPER: match student IDs', () => {
    const student = {
        id: 'studentId1',
    };
    describe('when the student ID matches the given element', () => {
        it('returns true', () => {
            expect(matchStudentIds(student)({
                id: 'studentId1',
            })).toEqual(true);
        });
    });
    describe('when the student ID does not match the given element', () => {
        it('returns false', () => {
            expect(matchStudentIds(student)({
                id: 'studentId2',
            })).toEqual(false);
        });
    });
});
