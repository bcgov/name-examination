let givenSomeoneHasAssignedNr = (given, data)=>{
    given(/^(.*) has an (.*) assigned name request (.*) with name (.*)$/, (user, state, nr, name) => {
        data.owner = user
        data.request = {
            nr:nr,
            state:state,
            name:name
        }
    })
}

module.exports = {
    givenSomeoneHasAssignedNr:givenSomeoneHasAssignedNr
}
