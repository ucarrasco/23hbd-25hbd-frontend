import React, { useContext, useState, useRef, useEffect } from 'react'
import { Input, FormGroup, Label, ButtonGroup, Button, ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, UncontrolledTooltip, Tooltip } from 'reactstrap'
import { FiltersContext } from './FiltersProvider'
import styled from 'styled-components'
import SearchIcon from '-!react-svg-loader!assets/images/search.svg'
import MediaQuery from 'react-responsive'
import { gridBreakpoints } from 'config/sassVariables'
import cn from 'classnames'
import useBreakpoint from 'utils/useBreakpoint'
import EyeIcon from '-!react-svg-loader!assets/images/eye.svg'
import { toast } from 'react-toastify'
import useMe from 'utils/useMe'
import ListIcon from '-!react-svg-loader!assets/images/list.svg'
import GridIcon from '-!react-svg-loader!assets/images/grid.svg'
import { Trans } from 'react-i18next'
import Checkbox from 'components/Checkbox'

const Toolbar = ({ additionalActions, editFollowed, stopEditFollowed }) => {
  const {
    search,
    setSearch,
    galleryMode,
    setGalleryMode,
    showReadStatuses,
    setShowReadStatuses,
} = useContext(FiltersContext)
  const [searchInputActive, setSearchInputActive] = useState(false)
  const searchInputRef = useRef(null)
  const toolbarRef = useRef()
  const searchActive = searchInputActive || !!search
  const sm = useBreakpoint("sm")
  const md = useBreakpoint("md")
  const me = useMe()
  return (
    <ToolbarContainer ref={toolbarRef}>
      {editFollowed
        ? (
          <div className="flex-grow-1 d-flex align-items-center">
            {t(`participations-page.groups.followed.edit-instructions`)}
            <Button color="primary" size="sm" className="ml-2" onClick={stopEditFollowed} style={{ whiteSpace: "nowrap" }}>
              {t(`participations-page.groups.followed.edit-done`)}
            </Button>
          </div>
        )
        : (
          <>
            <div className="flex-grow-1 d-flex align-items-center">
              <CompletionGroup>
                <CompletionItem completion="all">{t(`participations-page.completion-filter.any`)}</CompletionItem>
                <CompletionItem completion="nonEmpty">{t(`participations-page.completion-filter.non-empty`)}</CompletionItem>
                <CompletionItem completion="full">{t(`participations-page.completion-filter.full`)}</CompletionItem>
              </CompletionGroup>
              {
                !!me && (
                  <div className="ml-2 ml-lg-4">
                    {
                      md
                        ? (
                          <>
                            <Button
                              id="read-status-indicators-toggle"
                              color="completion-filter"
                              className={cn("btn-sm mb-0 d-flex align-items-center", { active: showReadStatuses })}
                              onClick={() => { setShowReadStatuses(!showReadStatuses)}}
                            >
                              <Checkbox
                                style={{
                                  marginRight: 5,
                                  transform: "translate(0, 2px)",
                                }}
                                checked={showReadStatuses}
                              />
                              {t(`participations-page.read-status-indicator.label`)}
                            </Button>
                            <UncontrolledTooltip placement="right" target="read-status-indicators-toggle" delay={{ show: 150, hide: 50 }}>
                              <ul className="text-left list-unstyled mb-0">
                                <li>
                                  <Trans i18nKey="participations-page.read-status-indicator.tooltip.unread">
                                    <span>noir</span> : non lu
                                  </Trans>
                                </li>
                                <li>
                                  <Trans i18nKey="participations-page.read-status-indicator.tooltip.partially-read">
                                    <span style={{ color: "#9c6b83" }}>violet</span> : lecture commencée
                                  </Trans>
                                </li>
                                <li>
                                  <Trans i18nKey="participations-page.read-status-indicator.tooltip.read">
                                    <span style={{ color: "#b5b5b5" }}>gris</span> : lecture finie
                                  </Trans>
                                </li>
                              </ul>

                            </UncontrolledTooltip>
                          </>
                        )
                        : (
                          <Button
                            color="completion-filter"
                            className="btn-sm"
                            active={showReadStatuses}
                            onClick={() => {
                              const newValue = !showReadStatuses
                              setShowReadStatuses(newValue)
                              toast.info(`Indicateurs de lecture ${newValue ? 'activés' : 'désactivés'}`)
                            }}
                          >
                            <EyeIcon
                              style={{ width: 16, height: 13 }}
                            />
                          </Button>
                        )
                    }
                  </div>
                )
              }

            </div>
            <AdditionalActionsContainer className={cn("align-items-center mr-4 ml-2", { 'search-active': searchActive})}>
              <ButtonGroup size="sm">
                <Button color="completion-filter" active={!galleryMode} onClick={() => { setGalleryMode(false) }}>
                  <ListIcon style={{ height: "1em", width: "1em" }} />
                  <span className="sr-only">
                    {t(`participations-page.display-mode.list`)}
                  </span>
                </Button>
                <Button color="completion-filter" active={galleryMode} onClick={() => { setGalleryMode(true) }}>
                  <GridIcon style={{ height: "1em", width: "1em" }} />
                  <span className="sr-only">
                    {t(`participations-page.display-mode.gallery`)}
                  </span>
                </Button>
              </ButtonGroup>
            </AdditionalActionsContainer>
          </>
        )
      }
      <SearchInputContainer className={cn("ml-2", { active: searchActive })}>
        <SearchIcon
          style={{
            height: "1em",
            width: "1em",
            alignSelf: "center",
            position: "absolute",
            marginLeft: "0.5em",
            fill: "#495057",
            pointerEvents: "none"
          }}
          className=""
        />
        <Input
          innerRef={searchInputRef}
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value) }}
          placeholder={t(`participations-page.user-search.placeholder`, { context: sm ? 'short' : 'long' })}
          bsSize="sm"
          style={{ paddingLeft: "2em", minWidth: sm ? "17em" : undefined }}
          onFocus={() => {
            setSearchInputActive(true)
            if (!sm) {
              // window.scrollTo({ top: (
              //   toolbarRef.current.getBoundingClientRect().y
              //   +
              //   window.scrollY
              //   -
              //   (document.querySelector(".hbd-autbar") |> (el => el ? el.getBoundingClientRect().height : 0))
              // )})
              setTimeout(
                () => {
                  window.scrollTo({ top: (
                    toolbarRef.current.getBoundingClientRect().y
                    +
                    window.scrollY
                    -
                    (document.querySelector(".hbd-autbar") |> (el => el ? el.getBoundingClientRect().height : 0))
                  )})
                },
                300
              )
            }
          }}
          onBlur={() => { setTimeout(() => { setSearchInputActive(false) }) }}
        />
        <div style={{ width: 0 }}>
          <SearchCloseButton
            close
            className={cn({ active: !!search })}
            onClick={() => {
              if (editFollowed) {
                searchInputRef.current.focus()
              }
              else {
                searchInputRef.current.blur()
              }
              setSearch("")
            }}
          />
        </div>
      </SearchInputContainer>
      <SearchIconHitBox
        className={searchActive ? "d-none" : "d-sm-none"}
        onClick={(e) => { searchInputRef.current.focus(e) }}
      />
    </ToolbarContainer>
  )
}

const CompletionGroup = ({ children, ...props }) => {
  const { completion, setCompletion } = useContext(FiltersContext)
  const [completionDropdownOpen, setCompletionDropdownOpen] = useState(false)
  const sm = useBreakpoint("sm")
  const md = useBreakpoint("md")

  children = React.Children.map(
    children,
    (child, i) =>
      React.cloneElement(child, {
        active: child.props.completion === completion,
        onClick: () => { setCompletion(child.props.completion) }
      })
  )

  if (md)
    return (
      <ButtonGroup size="sm" {...props}>
        {children}
      </ButtonGroup>
    )

  return (
    <ButtonDropdown isOpen={completionDropdownOpen} toggle={() => { setCompletionDropdownOpen(!completionDropdownOpen) }} className={sm ? undefined : "w-100"}>
      <DropdownToggle caret color="completion-filter" className="btn-sm pr-2">
        {children.find(child => child.props.active).props.children}
        {" "}
      </DropdownToggle>
      <DropdownMenu>
        {children}
      </DropdownMenu>
    </ButtonDropdown>
  )
}

const CompletionItem = ({ completion, ...props }) => {
  const sm = useBreakpoint("sm")
  return (
    sm
      ? (
        <Button
          color="completion-filter"
          {...props}
        />
      )
      : (
        <DropdownItem {...props} />
      )
  )
}

const ToolbarContainer = styled.div`
  border-bottom: solid 1px #ced4da;
  margin-top: -1.35rem;
  padding-top: 0.4rem;
  padding-bottom: 0.55rem;
  display: flex;
  align-items: center;
  flex-grow: 1;
  /* margin-left: calc(-1.5rem + 10px);
  margin-right: calc(-1.5rem + 10px); */
  margin-bottom: 12px;
  @media screen and (min-width: ${gridBreakpoints.sm}px) {
    margin-bottom: 24px;
    margin-left: 0;
    margin-right: 0;
  }
`

const SearchInputContainer = styled.div`
  display: flex;
  align-items: flex-end;

  &::before, &::after {
    content: "";
    display: block;
    width: 1px;
    background: #ced4da;
  }

  > input {
    background-color: transparent;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
    padding-right: 20px;
    &:focus {
      background-color: inherit;
      box-shadow: none;
      border-color: inherit;
    }
  }
  
  @media screen and (max-width: ${(gridBreakpoints.sm - 1).toString()}px) {
    width: 2em;
    clip-path: inset(0 calc(100% - 26px) 0 0);
    transform: translate(calc(100% - 26px), 0px);
    &.active {
      width: 10em;
      clip-path: inset(0 0 0 0);
      transform: translate(0, 0px);
    }
    /* transition: clip-path linear 0.3s, transform linear 0.3s; */
  }
`

const SearchCloseButton = styled(Button)`
  &.close {
    cursor: pointer;
    font-size: 1rem;
    position: relative;
    left: -3px;
    top: -5px;
    visibility: hidden;
    &.active {
      visibility: visible;
    }
  }
`

const SearchIconHitBox = styled.div`
  /* background-color: rgba(0, 0, 222, 0.14); */
  position: absolute;
  right: 0;
  width: 70px;
  height: 45px;
`

const AdditionalActionsContainer = styled.div`
  display: flex;
  &.search-active {
    display: none;
    @media screen and (min-width: 450px) {
      display: flex;
    }
  }
`



export default Toolbar
