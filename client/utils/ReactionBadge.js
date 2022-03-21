import React from 'react'
import cn from 'classnames'
import styled from 'styled-components'
import clapEmote from 'assets/images/emotes/clap.png'
import heartEyesEmote from 'assets/images/emotes/heart_eyes.png'
import joyEmote from 'assets/images/emotes/joy.png'
import screamEmote from 'assets/images/emotes/scream.png'
import cryEmote from 'assets/images/emotes/cry.png'
import { gridBreakpoints } from 'config/sassVariables'

const EMOTE_IMGS = {
  clap: clapEmote,
  heart_eyes: heartEyesEmote,
  joy: joyEmote,
  scream: screamEmote,
  cry: cryEmote,
}

const Emote = styled.span`
  display: inline-block;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background: url('${({ emote }) => EMOTE_IMGS[emote]}') no-repeat;
  background-size: 100% 100%;
`

const ReactionBadge = ({ checked, disabled, onClick, emote, size = 24, count, ...props }) => {
  if (disabled)
    onClick = undefined

  return (
    <ReactionBadgeContainer
      {...props}
      onClick={onClick}
      className={
        cn(
          props.className,
          {
            disabled,
            checked,
            empty: !count,
          }
        )
      }
    >
      <Emote emote={emote} size={size} />
      <span className="count">
        {count || (disabled ? "" : "+")}
      </span>
    </ReactionBadgeContainer>
  )
}

const ReactionBadgeContainer = styled.span`
  display: flex;
  align-items: center;
  background-color: #e8e8e8;
  border-radius: 16px;
  height: 32px;
  border: solid 1px #e2e2e2;
  cursor: pointer;
  @media (pointer: fine) {
    &.empty {
      opacity: 0.5;
      .count { opacity: 0.4; }
      .reactions-container:hover & {
        opacity: 1;
        .count { opacity: 1; }
      }
    }
    &.has-any-reaction {
      &.empty {
        display: none;
        .reactions-container:hover & {
          display: flex;
        }
      }
    }
  }
  &.disabled {
    cursor: default;
  }
  &:hover:not(.disabled) {
    border: solid 1px #b9b9b9;
    background-color: #e8e8e8;
  }
  margin-bottom: 4px;
  margin-right: 4px;
  &:last-child {
    margin-right: 0;
  }
  @media screen and (min-width: ${gridBreakpoints.sm}px) {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }

  padding-right: 15px;
  padding-left: 10px;
  &.checked {
    border: solid 1px #3c9ad2;
    background-color: #e5ecf7;
    &:hover {
      border: solid 1px #6ab3de;
      background-color: #e9eef7;
    }
  }

  > .count {
    margin-left: 6px;
    font-family: Arial, sans-serif;
    font-size: 20px;
    color: #5a5a5a;
  }
`
export default ReactionBadge
