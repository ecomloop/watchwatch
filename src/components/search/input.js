import React from "react"
import { connectSearchBox } from "react-instantsearch-dom"
import { SearchIcon, Form, Input } from "./styles"

export default connectSearchBox(({ refine, variation, ...rest }) => (
  <Form>
    <Input
      type="text"
      placeholder="city/state selector"
      aria-label="city/state selector"
      variation={variation}
      onChange={e => refine(e.target.value)}
      onMouseLeave={e => e.target.blur()}
      {...rest}
    />
    <SearchIcon variation={variation}/>
  </Form>
))
