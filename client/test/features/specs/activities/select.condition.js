let selectCondition = (when, data) => {
  when(/^he selects the first condition on (.*)/, (word) => {
    return new Promise((done) => {
      let row = data.vm.$el.querySelector('#condition tbody tr');
      console.log(row)
      expect(condition.innerHTML).toContain(word)
      let window = condition.ownerDocument.defaultView;
      var click = new window.Event('click');
      Object.defineProperty(click, 'target', { writable: false, value: row });
      row.dispatchEvent(click);
      setTimeout(() => {
        done();
      }, 1000)
    });
  });
}

module.exports = {
  selectCondition: selectCondition
}
