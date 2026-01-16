import { defineStore } from 'pinia'
import { Role, RouterMode, MeshRole, WifiVersion } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import { handleLogout } from '@/util/tool'
import { getLoginTimeout } from '@/http/api'

interface AppState {
  role: Role | null
  mode: RouterMode
  meshRole: MeshRole
  wifiVersion: WifiVersion
  loggedUser: string | null
  loginTimeoutTimer: number | null
}
const { convertBooleanStatus } = useDataClean()
export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    role: null,
    mode: RouterMode.router,
    meshRole: MeshRole.controller,
    wifiVersion: WifiVersion.v6,
    loggedUser: null,
    loginTimeoutTimer: null,
  }),
  getters: {
    isSuper: (state) => state.role && state.role === Role.super,
    isAdmin: (state) => state.role && state.role === Role.admin,
    isWifiV6: (state) => state.wifiVersion === WifiVersion.v6,
    isWifiV7: (state) => state.wifiVersion === WifiVersion.v7,
  },
  actions: {
    setRole(role: Role) {
      this.role = role
      sessionStorage.setItem('role', role)
    },
    setMode(mode: RouterMode) {
      this.mode = mode
      sessionStorage.setItem('mode', mode)
    },
    setWifiVersion(wifiVersion: WifiVersion) {
      this.wifiVersion = wifiVersion
      sessionStorage.setItem('wifiVersion', wifiVersion)
    },
    setLoggedUser(user: string) {
      this.loggedUser = user
      sessionStorage.setItem('logged_user', user)
    },
    loadFromStorage() {
      const savedRole = sessionStorage.getItem('role') as Role | null
      const savedMode = RouterMode.router // sessionStorage.getItem('mode') as RouterMode | null
      const savedMeshRole = MeshRole.controller // sessionStorage.getItem('meshRole') as MeshRole | null
      const savedWifiVersion = sessionStorage.getItem('wifiVersion') as WifiVersion | null
      const savedLoggedUser = sessionStorage.getItem('logged_user')

      if (savedRole) this.role = savedRole
      if (savedMode) this.mode = savedMode
      if (savedMeshRole) this.meshRole = savedMeshRole
      if (savedWifiVersion) this.wifiVersion = savedWifiVersion
      if (savedLoggedUser) this.loggedUser = savedLoggedUser
    },
    startLoginTimeoutCheck(isNoAuthPage: boolean) {
      if (this.loginTimeoutTimer) return
      this.loginTimeoutTimer = setInterval(() => {
        if (isNoAuthPage) {
          this.stopLoginTimeoutCheck()
        } else {
          this.getLoginTimeoutData()
        }
      }, 1000 * 10)
    },
    stopLoginTimeoutCheck() {
      clearInterval(this.loginTimeoutTimer!)
      this.loginTimeoutTimer = null
    },
    getLoginTimeoutData() {
      getLoginTimeout().then(({ data }) => {
        if (convertBooleanStatus(data.timeout)) {
          handleLogout()
        }
      })
    },
  },
})
