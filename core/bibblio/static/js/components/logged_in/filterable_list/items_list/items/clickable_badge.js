const ClickableBadge = (props) => {

  const [state, setState] = React.useState({
    user: {},

  })
  return (
    <ReactBootstrap.Badge
      pill
      bg={props.bg}
      onClick={props.onClick}
      value={props.value}
    >
      {props.name}
    </ReactBootstrap.Badge>
  )
}
