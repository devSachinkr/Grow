import { getUserDetails } from '@/lib/queries'
import { off } from 'process'
import React from 'react'
import MenuOption from './MenuOption'

type Props = {
  id: string
  type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
  const user = await getUserDetails()
  if (!user) return null

  if (!user.Agency) return

  const details =
    type === 'agency'
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)

  const isWhiteLabeledAgency = user.Agency.whiteLabel
  if (!details) return

  let sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'

  if (!isWhiteLabeledAgency) {
    if (type === 'subaccount') {
      sideBarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo
    }
  }

  const sidebarOpt =
    type === 'agency'
      ? user.Agency.sidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || []

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  )

  return (
    <>
      <MenuOption
        defaultOpen={true}
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOption={sidebarOpt}
        subAccount={subaccounts}
        user={user}
      />
      <MenuOption
        details={details}
        id={id}
        sideBarLogo={sideBarLogo}
        sideBarOption={sidebarOpt}
        subAccount={subaccounts}
        user={user}
      />
    </>
  )
}

export default Sidebar