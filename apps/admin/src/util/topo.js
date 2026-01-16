import SvgPathWireless from '@/assets/images/wireless.png'
import SvgPathWired from '@/assets/images/wired.png'
import SvgPathController from '@/assets/images/controller.png'
import SvgPathAgent from '@/assets/images/agent.png'
const DeviceRoleStr = 'Device role'
const AlMacStr = 'AL MAC'
const NeighborAlStr = 'neighbor_al'
const BhInfoStr = 'BH Info'
const BackhaulLinkMetricsStr = 'backhaul link metrics'
const NeighborAlmacAddrStr = 'neighbor almac addr'
const RssiStr = 'RSSI'
const OtherClientsInfoStr = 'Other Clients Info'
const ClientAddrStr = 'Client Address'
const BackhaulMediumTypeStr = 'Backhaul Medium Type'
const MediumStr = 'Medium'
const RadioInfoStr = 'Radio Info'
const BssInfoStr = 'BSSINFO'
const ConnectedStaInfoStr = 'connected sta info'
const StaMACAddrStr = 'STA MAC address'
const MldMacStr = 'MLD_MAC'
const UplinkRssiStr = 'uplink rssi'
const BhStaStr = 'BH STA'
const Upstream1905Device = 'Upstream 1905 device'

const DeviceRole = {
  controller: '01',
  agent: '02',
  wired: '03',
  wireless: '04',
}
const DeviceRoleText = {
  [DeviceRole.controller]: 'trans0572',
  [DeviceRole.agent]: 'trans0573',
  [DeviceRole.wired]: 'trans0495',
  [DeviceRole.wireless]: 'trans0943',
}
const OnlineStatus = {
  online: 'online',
  offline: 'offline',
}
const MediumType = {
  b5g: '5G',
  b24g: '2.4G',
  allWireless: '2.4G/5G',
  ethernet: 'Ethernet',
}
const MediumTypeText = {
  [MediumType.b5g]: 'trans0050',
  [MediumType.b24g]: 'trans0049',
  [MediumType.allWireless]: 'trans0051',
  [MediumType.ethernet]: 'trans0494',
}
const Color = {
  [DeviceRole.controller]: '#00d061',
  [DeviceRole.agent]: '#00d061',
  [DeviceRole.wired]: '#00d061',
  [DeviceRole.wireless]: '#00d061',
  offline: '#000',
  good: '#00d061',
  bad: '#ff6f00',
}
const GoodRssi = -70 // 大于-70均认为优秀
const isGood = (rssi) => rssi >= GoodRssi
let macArrAdded = {}
// 找网关
function findController(source) {
  return source.filter((s) => s[DeviceRoleStr] === DeviceRole.controller)[0]
}
function aliasMacAdded(mac, isCount = true) {
  if (macArrAdded.hasOwnProperty(mac)) {
    macArrAdded[mac] = macArrAdded[mac] + 1
  } else {
    macArrAdded[mac] = 0
  }
  if (isCount) {
    return !macArrAdded[mac] ? mac : `${mac}(${macArrAdded[mac]})`
  } else {
    return mac
  }
}
// 补充关系
function addConnection(source) {
  macArrAdded = {}
  let newSource = []
  let divices = []
  let agentIndex = 0
  let deviceIndex = 0
  source.forEach((s) => {
    let neighbors = []
    // 有邻居结点
    // if (s[BackhaulLinkMetricsStr]) {
    //   s[BackhaulLinkMetricsStr].forEach((n) => {
    //     // 邻居节点
    //     const neighborNode = source.filter((ss) => ss[AlMacStr] === n[NeighborAlStr])[0]
    //     // 邻居中有该节点，但是该节点不在数据源中
    //     if (!neighborNode) {
    //       return
    //     }
    //     if (s[DeviceRoleStr] === DeviceRole.controller) {
    //       // 从邻居结点取自己的信息
    //       const self = neighborNode[BhInfoStr].filter(
    //         (nr) => nr[NeighborAlmacAddrStr] === s[AlMacStr],
    //       )[0]
    //       if (self) {
    //         neighbors.push({
    //           mac: n[NeighborAlStr],
    //           rssi: Number(self[RssiStr]),
    //           type: self[BackhaulMediumTypeStr], // 连接上级节点使用的频段
    //           [DeviceRoleStr]: neighborNode[DeviceRoleStr],
    //         })
    //       }
    //     }
    //     if (s[DeviceRoleStr] === DeviceRole.agent) {
    //       // 从自身的"BH Info"获取邻居结点的信息
    //       const node = s[BhInfoStr].filter(
    //         (nr) => nr[NeighborAlmacAddrStr] === neighborNode[AlMacStr],
    //       )[0]
    //       if (node) {
    //         neighbors.push({
    //           mac: node[NeighborAlmacAddrStr],
    //           rssi: Number(node[RssiStr]),
    //           type: node[BackhaulMediumTypeStr],
    //           [DeviceRoleStr]: neighborNode[DeviceRoleStr],
    //         })
    //       }
    //     }
    //   })
    // }
    // 节点
    if (s[Upstream1905Device]) {
      const neighborNode = source.find((ss) => ss[AlMacStr] === s[Upstream1905Device])
      if (!neighborNode) {
        return
      }
      // controller 节点
      if (s[DeviceRoleStr] === DeviceRole.controller) {
        // 从邻居结点取自己的信息
        const self = neighborNode[BhInfoStr].filter(
          (nr) => nr[NeighborAlmacAddrStr] === s[AlMacStr],
        )[0]
        if (self) {
          neighbors.push({
            mac: neighborNode[AlMacStr],
            rssi: Number(self[RssiStr]),
            type: self[BackhaulMediumTypeStr], // 连接上级节点使用的频段
            [DeviceRoleStr]: neighborNode[DeviceRoleStr],
          })
        }
      }
      // agent 节点
      if (s[DeviceRoleStr] === DeviceRole.agent) {
        // 从自身的"BH Info"获取邻居结点的信息
        const self = s[BhInfoStr].filter(
          (nr) => nr[NeighborAlmacAddrStr] === neighborNode[AlMacStr],
        )[0]
        if (self) {
          neighbors.push({
            mac: self[NeighborAlmacAddrStr],
            rssi: Number(self[RssiStr]),
            type: self[BackhaulMediumTypeStr],
            [DeviceRoleStr]: neighborNode[DeviceRoleStr],
          })
        }
      }
    }
    // 有线设备
    if (s[OtherClientsInfoStr]?.length) {
      s[OtherClientsInfoStr].forEach((n) => {
        let mac = aliasMacAdded(n[ClientAddrStr])
        neighbors.push({
          mac,
          rssi: 0,
          type: n[MediumStr],
          [DeviceRoleStr]: DeviceRole.wired,
        })
        divices.push({
          mac,
          [DeviceRoleStr]: DeviceRole.wired,
          name: `Device ${++deviceIndex}`,
          neighbors: [],
        })
      })
    }
    // 无线设备
    if (s[RadioInfoStr]?.length) {
      s[RadioInfoStr].forEach((r) => {
        if (r[BssInfoStr]?.length) {
          r[BssInfoStr].forEach((b) => {
            if (b[ConnectedStaInfoStr]?.length) {
              b[ConnectedStaInfoStr].forEach((sta) => {
                let mac = aliasMacAdded(sta[MldMacStr] ? sta[MldMacStr] : sta[StaMACAddrStr])
                if (sta[BhStaStr] === 'No') {
                  neighbors.push({
                    mac,
                    rssi: sta[UplinkRssiStr],
                    type: sta[MediumStr],
                    [DeviceRoleStr]: DeviceRole.wireless,
                  })
                  divices.push({
                    mac,
                    [DeviceRoleStr]: DeviceRole.wireless,
                    name: `Device ${++deviceIndex}`,
                    neighbors: [],
                  })
                }
              })
            }
          })
        }
      })
    }
    newSource.push({
      mac: aliasMacAdded(s[AlMacStr]),
      neighbors,
      name: s[DeviceRoleStr] === DeviceRole.agent ? `Agent ${++agentIndex}` : 'Controller',
      ...s,
    })
  })
  return [...newSource, ...divices]
}
// 找绿色节点
function findGreenNode(root, source, visited) {
  let green = []
  if (root?.neighbors?.length) {
    root.neighbors.forEach((n) => {
      const node = source.find((s) => s.mac === n.mac)
      if (visited.includes(node)) {
        return
      }
      visited.push(node)
      if (isGood(n.rssi)) {
        green.push(node)
        green = green.concat(findGreenNode(node, source, visited))
      }
    })
  }
  return green
}
// 找红色节点
function findRedNode(green, nodes) {
  const red = []
  nodes.forEach((s) => {
    if (!green.includes(s)) {
      red.push(s)
    }
  })
  return red
}
// 找离线节点
function findOfflineNode(array, offline) {
  // 目前都是在线结点, 暂不考虑这种情况
  return array
}
// 生成绘图需要的节点数据
function genNodes(gateway, green, red, offline, chart) {
  function genNode(node, onlineStatus, symbolSize = 50) {
    let symbol = ''
    let color = ''
    if (onlineStatus === OnlineStatus.offline) {
      color = Color.offline
    } else {
      color = Color[node[DeviceRoleStr]]
    }
    if (node[DeviceRoleStr] === DeviceRole.controller) {
      symbol = SvgPathController
    } else if (node[DeviceRoleStr] === DeviceRole.agent) {
      symbol = SvgPathAgent
    } else if (node[DeviceRoleStr] === DeviceRole.wired) {
      symbol = SvgPathWired
    } else if (node[DeviceRoleStr] === DeviceRole.wireless) {
      symbol = SvgPathWireless
    }
    let n = {
      name: node.mac,
      originName: node.name, // 用于节点的label显示
      nodeType: node[DeviceRoleStr],
      stationsCount: node.neighbors.filter(
        (n) => n[DeviceRoleStr] === DeviceRole.wired || n[DeviceRoleStr] === DeviceRole.wireless,
      ).length,
      itemStyle: {
        color,
      },
      symbol: `image://${symbol}`,
      symbolSize,
      symbolKeepAspect: true,
    }
    if (node[DeviceRoleStr] === DeviceRole.controller) {
      n = {
        ...n,
        fixed: true,
        x: chart.getWidth() / 2,
        y: chart.getHeight() / 2,
      }
    }
    return n
  }
  const nodes = []
  const nodeCount = 1 + green.length + red.length + offline.length
  const symbolSize = [30, 30]
  if (nodeCount >= 8) {
    symbolSize[0] = 20
    symbolSize[1] = 20
  }
  nodes.push(genNode(gateway, OnlineStatus.online, symbolSize[0]))
  const allNodes = [...green, ...red]
  allNodes.forEach((n) => {
    nodes.push(genNode(n, OnlineStatus.online, symbolSize[1]))
  })
  offline.forEach((o) => {
    nodes.push(genNode(o, OnlineStatus.offline, symbolSize[1]))
  })
  return nodes
}
// 生成绘图需要的线条信息
function genLines(gateway, green, red, nodes, fullLine) {
  function genLine(source, target, color, value = 0) {
    return {
      source: source.mac,
      target: target.mac,
      rssi: value,
      type: source.neighbors.find((n) => n.mac === target.mac).type,
      lineStyle: {
        color,
      },
    }
  }
  const drawed = []
  function exist(node1, node2) {
    const temp1 = `${node1.mac}${node2.mac}`
    const temp2 = `${node2.mac}${node1.mac}`
    if (!drawed.includes(temp1) && !drawed.includes(temp2)) {
      drawed.push(temp1)
      drawed.push(temp2)
      return false
    }
    return true
  }

  const lines = []

  gateway.neighbors.forEach((n) => {
    const node = nodes.find((s) => s.mac === n.mac)
    if (!exist(node, gateway)) {
      if (n.type === MediumType.ethernet || isGood(n.rssi)) {
        lines.push(genLine(gateway, node, Color.good, n.rssi))
      } else if (red.includes(node)) {
        lines.push(genLine(gateway, node, Color.bad, n.rssi))
      } else if (fullLine) {
        lines.push(genLine(gateway, node, Color.bad, n.rssi))
      }
    }
  })

  red.forEach((r) => {
    r.neighbors.forEach((n) => {
      const node = nodes.find((s) => s.mac === n.mac)
      if (!exist(node, r)) {
        if (n.type === MediumType.ethernet || isGood(n.rssi)) {
          lines.push(genLine(r, node, Color.good, n.rssi))
        } else {
          lines.push(genLine(r, node, Color.bad, n.rssi))
        }
      }
    })
  })

  green.forEach((r) => {
    r.neighbors.forEach((n) => {
      const node = nodes.find((s) => s.mac === n.mac)
      if (!exist(node, r)) {
        if (isGood(n.rssi)) {
          lines.push(genLine(r, node, Color.good, n.rssi))
        } else if (!green.includes(node)) {
          lines.push(genLine(r, node, Color.bad, n.rssi))
        } else if (fullLine) {
          lines.push(genLine(r, node, Color.bad, n.rssi))
        }
      }
    })
  })
  return lines
}
// 生成所有绘图数据
function genData(routers, chart, fullLine) {
  console.log('routers origin', routers)

  const offline = []
  routers = findOfflineNode(routers, offline)
  console.log('offline node', offline)
  routers = addConnection(routers)
  console.log('routers before add connection', routers)
  const controller = findController(routers)
  if (!controller) {
    console.log('no master node')
    return
  }
  console.log('controller node', controller)
  const visited = [controller]
  const green = findGreenNode(controller, routers, visited)
  console.log('green node', green)
  const meshNodes = routers.filter((r) => r.mac !== controller.mac)
  const red = findRedNode(green, meshNodes)
  console.log('red node', red)

  const nodes = genNodes(controller, green, red, offline, chart)
  const lines = genLines(controller, green, red, routers, fullLine)
  console.log('nodes', nodes, 'lines', lines)

  return {
    nodes,
    lines,
  }
}

export { genData, MediumTypeText, DeviceRoleText }
