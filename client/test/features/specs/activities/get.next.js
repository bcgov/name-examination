let getNext = (when, data)=>{
    when(/^(.*) accesses the next examination$/, (userId) => {
        data.stubApi({ user:userId })
        return new Promise((done) => {
            let button = data.vm.$el.querySelector('#examine-get-next-button');
            expect(button).not.toEqual(null)
            let window = button.ownerDocument.defaultView;
            var click = new window.Event('click');
            button.dispatchEvent(click);
            setTimeout(()=>{
                done();
            }, 1000)
        });
    });
}

module.exports = {
    getNext:getNext
}
