const ClickableBadge = (props) => {


  return (
    <ReactBootstrap.Badge
      pill
      className="mx-1"
      as="button"
      bg={props.bg}
      onClick={props.onClick}
      value={props.value}
      text={props.bg === "light" ? "dark" : "light"}
    >
      {props.name}
    </ReactBootstrap.Badge>
  )
}
