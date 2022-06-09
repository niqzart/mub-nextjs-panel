import { AppBar, Button, Stack, Toolbar } from "@mui/material"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"

import { useAppSelector } from "../../data/hooks"
import { signOut } from "../../data/slices/moderator"
import { authorizedFetch } from "../../utils/fetcher"
import { useRequestorBase } from "../../utils/requestor"
import { Link } from "./navigation"

interface HeaderButtonProps {
  text: string
  selected?: boolean
  onClick?: any
}

interface HeaderItemProps {
  href: string
  text: string
  path?: string
  selected?: boolean
}

function HeaderButton({ text, selected, onClick }: HeaderButtonProps) {
  return <Button sx={{ color: selected ? "secondary.main" : "common.white" }} onClick={onClick}>{text.toUpperCase()}</Button>
}

function HeaderItem({ href, text, path, selected }: HeaderItemProps) {
  const { t } = useTranslation("common")
  return <Link href={href}>
    <HeaderButton
      text={t(text)}
      selected={selected === undefined ? href === path : selected}
    />
  </Link>
}

function AuthorizedHeader() {
  const { router, dispatch } = useRequestorBase()
  const path: string = router.asPath

  const permissions = useAppSelector(state => state.moderator.permissions)

  return <AppBar position="fixed" enableColorOnDark>
    <Toolbar variant="dense">
      <Stack direction="row" sx={{ width: "25%" }}>
        <HeaderItem href="/" path={path} text="header-home" />
      </Stack>
      <Stack direction="row" sx={{ width: "50%", justifyContent: "center" }}>
        {router.asPath !== "/" && permissions?.map((item, key) =>
          <HeaderItem
            text={item.name}
            key={key}
            path={path}
            href={`/categories/${item.name.replace(" ", "-")}`}
            selected={path.startsWith(`/categories/${item.name.replace(" ", "-")}`)}
          />
        )}
      </Stack>
      <Stack direction="row-reverse" sx={{ width: "25%" }}>
        <HeaderItem text="support" href="/support" path={path} />
        <HeaderButton text="log out" onClick={() => {
          authorizedFetch("/sign-out/", { method: "post" })
          dispatch(signOut())
          router.push("/signin/")
        }} />
      </Stack>
    </Toolbar>
  </AppBar>
}

function OutsiderHeader() {
  const router = useRouter()
  const path: string = router.asPath

  return <AppBar position="fixed" enableColorOnDark>
    <Toolbar variant="dense">
      <Stack direction="row-reverse" sx={{ width: "100%" }}>
        <HeaderItem text="support" href="/support" path={path} />
        <HeaderItem text="sign in" href="/signin" path={path} />
      </Stack>
    </Toolbar>
  </AppBar>
}

export default function Header() {
  const authorized = useAppSelector(state => state.moderator.authorized)
  return authorized ? <AuthorizedHeader /> : <OutsiderHeader />
}
