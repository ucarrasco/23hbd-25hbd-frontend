import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import useMe from 'utils/useMe'
import { Button } from 'reactstrap'
import styled from 'styled-components'

function BecomePanel() {
  const [isInBecome, setIsInBecome] = useState(!!Cookies.get('becomePreviousToken'))
  const me = useMe()
  const endBecomeSession = () => {
    Cookies.set('accessToken', Cookies.get('becomePreviousToken'), { expires: 45 })
    Cookies.remove('becomePreviousToken')
    window.location.href = "/"
  }
  
  if (!isInBecome || !me) return null
  return (
    <Panel>
      <div>Mode "become" avec le compte {me.slug}</div>
      <div>
        <Button size="sm" color="link" onClick={endBecomeSession}>
          Fin du become
        </Button>
      </div>
    </Panel>
  )
}

const Panel = styled.div`
  position: fixed;
  z-index: 10;
  right: 0;
  bottom: 5vh;
  background-color: #fffaf3;
  padding: 10px 20px;
  width: 200px;
  text-align: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top: solid 1px #ccc;
  border-left: solid 1px #ccc;
  border-bottom: solid 1px #ccc;
  box-shadow: -2px 2px 7px #00000003;
`

export default BecomePanel
