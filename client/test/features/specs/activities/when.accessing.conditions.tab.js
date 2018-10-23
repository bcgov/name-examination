let whenSomeoneAccessConditionsTab = (when, data)=>{
    when(/^he accesses conditions tab$/, (userId) => {
        return new Promise((done) => {
            let button = data.vm.$el.querySelector('#conditions-tab');
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
    whenSomeoneAccessConditionsTab:whenSomeoneAccessConditionsTab
}
