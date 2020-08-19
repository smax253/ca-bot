const matchStudentIds = (student) => {
    return (elem) => elem.id === student.id;
};
module.exports = matchStudentIds;
