const Persons = require("./../model/personModel");

exports.newPerson = async (req, res, next) => {
  // id,familyId,firstName,lastName,dob,baptism,marriage,death,phoneNumber,gender,wardNo

  const addPerson = await Persons.create(req.body);

  res.status(201).json({
    status: "success",
  });
};

exports.getPerson = async (req, res, next) => {
  // console.log(req.body.userId);
  const person = await Persons.findOne({
    userId: req.body.userId,
  });

  res.status(201).json({
    status: "success",
    person,
  });
};
