import d3 from "d3";
import moment from "moment";
import $ from "jquery";
import EventEmitter from "eventEmitter";

export default function menu(element) {

  let menu = new EventEmitter(),
      selection = d3.select(element),
      selected = "";

  $(element).on("click", ".session", function() {
    let data = d3.select(this).datum();
    if (data) menu.select(data._id);
  });

  menu.select = function(id) {
    selected = id;
    menu.render();
    menu.emit("select", id);
    return menu;
  };

  menu.render = function(data) {

    let oldData = selection.selectAll("li").data();

    let sessionList = selection.selectAll("li")
        .data(data || oldData);

    sessionList.exit().remove();

    sessionList.enter().append("li")
      .attr("class", "session");

    sessionList
      .classed("selected", (d) => d._id === selected)
      .html(({ host, begin }) => {
        let date = moment(begin);
        let moreThanADay = moment().subtract(1, "days") > date;
        let dateString = moreThanADay ? date.format("ddd, D MMM YYYY HH:mm")
                                      : date.fromNow();
        return `
          <div class="host">${host}</div>
          <div class="date">${dateString}</div>
        `;
      });

    return menu;
  };

  return menu;

}
