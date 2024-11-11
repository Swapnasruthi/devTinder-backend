const validatingProfileEdits = (req)=>{
    const allowedUpdates = [
        "firstName",
        "lastName",
        "about",
        "userPhoto",
        "skills",
        "age",
        "gender"
    ];

    const isUpdatesAllowed = Object.keys(req.body).every((field) => (allowedUpdates.includes(field)));

    return isUpdatesAllowed;
}

module.exports = {validatingProfileEdits};