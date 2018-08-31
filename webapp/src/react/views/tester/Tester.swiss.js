import { styleSheet } from "swiss-react";

export default styleSheet("Tester", {
  Wrapper: {
    overflowY: "scroll"
  },
  Header: {
    _flex: ["row", "between", "center"],
    padding: "10px 24px"
  },
  HeaderTitle: {
    _el: "h1"
  }
});
