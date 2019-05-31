let heSeesNrStatusIsApproved = (then, data)=>{
    then(/^he sees that (.*) is now (.*)/, (nr, state) => {
        expect(data.vm.$el.querySelector('#nrNumberDisplay').textContent).toContain(nr)
        expect(data.vm.$el.querySelector('#nrStatusText').textContent).toContain('APPROVED')
    });
}

module.exports = {
    heSeesNrStatusIsApproved:heSeesNrStatusIsApproved
}
