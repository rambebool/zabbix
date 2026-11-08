import { Section } from './types';

export const initialData: Section[] = [
  {
    id: 'template',
    title: '1. Элементы уровня шаблона',
    groups: [
      {
        id: 'raw',
        name: 'Сырьё (мастера), тег component: raw',
        items: [
          { id: 't1', name: 'Windows updates: Get installed KBs', key: 'wmi.getall[root\\cimv2,"select … from Win32_QuickFixEngineering"]', type: 'агент', interval: '1h', status: 'active', note: 'МАСТЕР для цепочки обновлений', isMaster: true },
          { id: 't2', name: 'Windows activation: Get product info', key: 'wmi.getall[root\\CIMV2,"select … from SoftwareLicensingProduct …"]', type: 'агент', interval: '12h', status: 'active', note: 'МАСТЕР активации (продукт)', isMaster: true },
          { id: 't3', name: 'Windows activation: Get service info', key: 'wmi.getall[root\\CIMV2,"select … from SoftwareLicensingService"]', type: 'агент', interval: '12h', status: 'active', note: 'МАСТЕР активации (KMS-сервис)', isMaster: true },
          { id: 't4', name: 'Windows: Network interfaces WMI get', key: 'wmi.getall[root\\cimv2,"select … from win32_networkadapter …"]', type: 'агент', interval: '1m', status: 'active', note: 'МАСТЕР сетевых интерфейсов', isMaster: true },
          { id: 't5', name: 'Windows TPM: Get info', key: 'wmi.getall[root\\CIMV2\\Security\\MicrosoftTpm,"select … from Win32_Tpm"]', type: 'агент', interval: '1h', status: 'active', note: 'МАСТЕР TPM; цепочка не погашена в экспорте', isMaster: true },
          { id: 't6', name: 'Windows BitLocker: Get encryptable volumes', key: 'wmi.getall[root\\CIMV2\\Security\\MicrosoftVolumeEncryption,"select …"]', type: 'агент', interval: '30m', status: 'active', note: 'МАСТЕР; LLD отключён → рекомендуется погасить', isMaster: true },
          { id: 't7', name: 'Windows Defender: Get status', key: 'wmi.getall[root\\Microsoft\\Windows\\Defender,"select … from MSFT_MpComputerStatus"]', type: 'агент', interval: '30m', status: 'active', note: 'МАСТЕР Defender', isMaster: true },
          { id: 't8', name: 'Windows scheduled tasks: Get tasks', key: 'wmi.getall[root\\Microsoft\\Windows\\TaskScheduler,"select … from MSFT_ScheduledTask"]', type: 'агент', interval: '30m', status: 'active', note: 'МАСТЕР; LLD отключён → рекомендуется погасить', isMaster: true },
          { id: 't9', name: 'Windows Firewall: Get profiles', key: 'wmi.getall[root\\StandardCimv2,"select … from MSFT_NetFirewallProfile"]', type: 'агент', interval: '30m', status: 'active', note: 'МАСТЕР профилей фаервола', isMaster: true },
        ]
      },
      {
        id: 'system',
        name: 'Система и агент (component: system / application)',
        items: [
          { id: 't10', name: 'Host name of Zabbix agent running', key: 'agent.hostname', type: 'агент', interval: '1h', status: 'active', note: 'имя хоста глазами агента' },
          { id: 't11', name: 'Zabbix agent ping', key: 'agent.ping', type: 'агент', interval: '1m', status: 'active', note: 'доступность агента (ping)' },
          { id: 't12', name: 'Version of Zabbix agent running', key: 'agent.version', type: 'агент', interval: '1h', status: 'active', note: 'версия агента' },
          { id: 't13', name: 'System name', key: 'system.hostname', type: 'агент', interval: '1h', status: 'active', note: 'inventory: NAME', hasTrigger: true, triggerNote: 'имя изменилось (INFO)' },
          { id: 't14', name: 'System local time', key: 'system.localtime[local]', type: 'агент', interval: '1m', status: 'active', note: 'локальное время (виджет часов)' },
          { id: 't15', name: 'System description', key: 'system.uname', type: 'агент', interval: '15m', status: 'active', note: 'описание системы (шапка дашборда)' },
          { id: 't16', name: 'Uptime', key: 'system.uptime', type: 'агент', interval: '30s', status: 'active', note: '', hasTrigger: true, triggerNote: 'перезагрузка (WARN)' },
          { id: 't17', name: 'Zabbix agent availability', key: 'zabbix[host,agent,available]', type: 'internal', interval: '1m', status: 'active', note: 'только для пассивных агентов', hasTrigger: true, triggerNote: 'агент недоступен (AVG)' },
        ]
      },
      {
        id: 'cpu',
        name: 'Процессор (component: cpu)',
        items: [
          { id: 't18', name: 'CPU utilization', key: 'system.cpu.util', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'высокая утилизация (WARN)' },
          { id: 't19', name: 'Number of cores', key: 'wmi.get[root/cimv2,"Select NumberOfLogicalProcessors …"]', type: 'агент', interval: '1m', status: 'active', note: 'логические ядра; участвует в триггере очереди' },
          { id: 't20', name: 'CPU user time', key: 'perf_counter_en["\\Processor Information(_total)\\% User Time"]', type: 'агент', interval: '1m', status: 'active', note: 'user-время' },
          { id: 't21', name: 'CPU privileged time', key: 'perf_counter_en["\\Processor Information(_total)\\% Privileged Time"]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'privileged high (WARN)' },
          { id: 't22', name: 'CPU interrupt time', key: 'perf_counter_en["\\Processor Information(_total)\\% Interrupt Time"]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'interrupt high (WARN)' },
          { id: 't23', name: 'CPU DPC time', key: 'perf_counter_en["\\Processor Information(_total)\\% DPC Time"]', type: 'агент', interval: '1m', status: 'active', note: 'DPC-время' },
          { id: 't24', name: 'CPU queue length', key: 'perf_counter_en["\\System\\Processor Queue Length"]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'очередь слишком длинная (WARN, шабл. уровень)' },
          { id: 't25', name: 'Context switches per second', key: 'perf_counter_en["\\System\\Context Switches/sec"]', type: 'агент', interval: '1m', status: 'active', note: 'переключения контекста' },
        ]
      },
      {
        id: 'memory',
        name: 'Память и подкачка (component: memory / storage)',
        items: [
          { id: 't26', name: 'Memory utilization', key: 'vm.memory.size[pused]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'высокая утилизация (AVG)' },
          { id: 't27', name: 'Total memory', key: 'vm.memory.size[total]', type: 'агент', interval: '1m', status: 'active', note: 'всего ОЗУ' },
          { id: 't28', name: 'Used memory', key: 'vm.memory.size[used]', type: 'агент', interval: '1m', status: 'active', note: 'занято ОЗУ' },
          { id: 't29', name: 'Cache bytes', key: 'perf_counter_en["\\Memory\\Cache Bytes"]', type: 'агент', interval: '1m', status: 'active', note: 'кэш' },
          { id: 't30', name: 'Free system page table entries', key: 'perf_counter_en["\\Memory\\Free System Page Table Entries"]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'мало записей таблиц страниц (WARN)' },
          { id: 't31', name: 'Memory page faults per second', key: 'perf_counter_en["\\Memory\\Page Faults/sec"]', type: 'агент', interval: '1m', status: 'active', note: 'page faults' },
          { id: 't32', name: 'Memory pages per second', key: 'perf_counter_en["\\Memory\\Pages/sec"]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'Pages/sec high (WARN)' },
          { id: 't33', name: 'Memory pool non-paged', key: 'perf_counter_en["\\Memory\\Pool Nonpaged Bytes"]', type: 'агент', interval: '1m', status: 'active', note: 'non-paged pool' },
          { id: 't34', name: 'Used swap space in %', key: 'perf_counter_en["\\Paging file(_Total)\\% Usage"]', type: 'агент', interval: '1m', status: 'active', note: 'МАСТЕР для swap.pfree', isMaster: true },
          { id: 't35', name: 'Free swap space in %', key: 'system.swap.pfree', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'high swap usage (WARN, шабл. уровень)' },
          { id: 't36', name: 'Free swap space', key: 'system.swap.size[,free]', type: 'агент', interval: '1m', status: 'active', note: 'свободно подкачки' },
          { id: 't37', name: 'Total swap space', key: 'system.swap.size[,total]', type: 'агент', interval: '1m', status: 'active', note: 'всего подкачки' },
        ]
      },
      {
        id: 'os',
        name: 'ОС и обновления (component: os)',
        items: [
          { id: 't38', name: 'Operating system', key: 'system.sw.os', type: 'агент', interval: '1h', status: 'active', note: 'inventory: OS', hasTrigger: true, triggerNote: 'ОС изменилась (INFO)' },
          { id: 't39', name: 'Operating system architecture', key: 'system.sw.arch', type: 'агент', interval: '1h', status: 'active', note: 'архитектура ОС' },
          { id: 't40', name: 'Number of processes', key: 'proc.num[]', type: 'агент', interval: '1m', status: 'active', note: 'число процессов' },
          { id: 't41', name: 'Number of threads', key: 'perf_counter_en["\\System\\Threads"]', type: 'агент', interval: '1m', status: 'active', note: 'число потоков' },
          { id: 't42', name: 'Windows updates: Days since last KB', key: 'updates.kb.days', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'давно нет KB (WARN)' },
          { id: 't43', name: 'Windows updates: Last KB install date', key: 'updates.kb.last.date', type: 'зависимый', interval: '—', status: 'active', note: 'дата последнего KB' },
          { id: 't44', name: 'Windows updates: Last KB ID', key: 'updates.kb.last.id', type: 'зависимый', interval: '—', status: 'active', note: 'ID последнего KB' },
          { id: 't45', name: 'Windows updates: KBs installed (total)', key: 'updates.kb.total', type: 'зависимый', interval: '—', status: 'active', note: 'всего KB' },
          { id: 't46', name: 'Windows updates: Security KBs installed', key: 'updates.kb.security', type: 'зависимый', interval: '—', status: 'active', note: 'всего security KB' },
          { id: 't47', name: 'Windows updates: Days since last Security KB', key: 'updates.security.days', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'давно нет security KB (AVG)' },
          { id: 't48', name: 'Windows updates: Last Security KB install date', key: 'updates.security.last.date', type: 'зависимый', interval: '—', status: 'active', note: 'дата последнего security KB' },
        ]
      },
      {
        id: 'security-activation',
        name: 'Безопасность: активация (component: security)',
        items: [
          { id: 't49', name: 'Windows activation: License status', key: 'activation.license.status', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'не лицензировано (WARN)' },
          { id: 't50', name: 'Windows activation: Grace period remaining', key: 'activation.grace', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'grace-период истекает (WARN)' },
          { id: 't51', name: 'Windows activation: Product name', key: 'activation.product.name', type: 'зависимый', interval: '—', status: 'active', note: 'имя продукта' },
          { id: 't52', name: 'Windows activation: Partial product key', key: 'activation.product.key', type: 'зависимый', interval: '—', status: 'active', note: 'последние 5 символов ключа' },
          { id: 't53', name: 'Windows activation: Client machine ID', key: 'activation.client.id', type: 'зависимый', interval: '—', status: 'active', note: 'KMS client ID' },
          { id: 't54', name: 'Windows activation: KMS server', key: 'activation.kms.server', type: 'зависимый', interval: '—', status: 'active', note: 'KMS-сервер' },
          { id: 't55', name: 'Windows activation: KMS port', key: 'activation.kms.port', type: 'зависимый', interval: '—', status: 'active', note: 'порт KMS' },
          { id: 't56', name: 'Windows activation: Is KMS host', key: 'activation.kms.host', type: 'зависимый', interval: '—', status: 'active', note: 'является ли KMS-хостом' },
          { id: 't57', name: 'Windows activation: Status reason code', key: 'activation.status.reason', type: 'зависимый', interval: '—', status: 'active', note: 'код причины статуса' },
        ]
      },
      {
        id: 'security-defender',
        name: 'Безопасность: Defender / SecureBoot / TPM / фаервол-мастер (component: security)',
        items: [
          { id: 't58', name: 'Windows Defender: AM service enabled', key: 'defender.amservice.enabled', type: 'зависимый', interval: '—', status: 'active', note: 'служба AM' },
          { id: 't59', name: 'Windows Defender: Antivirus enabled', key: 'defender.av.enabled', type: 'зависимый', interval: '—', status: 'active', note: 'антивирус' },
          { id: 't60', name: 'Windows Defender: Antispyware enabled', key: 'defender.as.enabled', type: 'зависимый', interval: '—', status: 'active', note: 'антиспайвар' },
          { id: 't61', name: 'Windows Defender: Real-time protection enabled', key: 'defender.rtp.enabled', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'RTP выключена (AVG)' },
          { id: 't62', name: 'Windows Defender: Antivirus signature age', key: 'defender.av.signature.age', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'сигнатуры устарели (WARN)' },
          { id: 't63', name: 'Windows Defender: Antispyware signature age', key: 'defender.as.signature.age', type: 'зависимый', interval: '—', status: 'active', note: 'возраст сигнатур AS' },
          { id: 't64', name: 'Windows Defender: Antivirus signature version', key: 'defender.av.signature.version', type: 'зависимый', interval: '—', status: 'active', note: 'версия сигнатур' },
          { id: 't65', name: 'Windows Defender: Full scan age', key: 'defender.fullscan.age', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'полный скан просрочен (WARN)' },
          { id: 't66', name: 'Windows Defender: Quick scan age', key: 'defender.quickscan.age', type: 'зависимый', interval: '—', status: 'active', note: 'возраст быстрого скана' },
          { id: 't67', name: 'Windows SecureBoot: State', key: 'registry.data[HKEY_LOCAL_MACHINE\\…\\SecureBoot\\State,UEFISecureBootEnabled]', type: 'агент', interval: '1h', status: 'active', note: '', hasTrigger: true, triggerNote: 'SecureBoot выключен (WARN)' },
          { id: 't68', name: 'Windows TPM: Presence', key: 'tpm.presence', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'TPM отсутствует (INFO)' },
          { id: 't69', name: 'Windows TPM: Activated', key: 'tpm.activated', type: 'зависимый', interval: '—', status: 'active', note: 'TPM активирован' },
          { id: 't70', name: 'Windows TPM: Enabled', key: 'tpm.enabled', type: 'зависимый', interval: '—', status: 'active', note: 'TPM включён' },
          { id: 't71', name: 'Windows TPM: Owned', key: 'tpm.owned', type: 'зависимый', interval: '—', status: 'active', note: 'TPM имеет владельца' },
          { id: 't72', name: 'Windows TPM: Spec version', key: 'tpm.spec.version', type: 'зависимый', interval: '—', status: 'active', note: 'версия спецификации' },
          { id: 't73', name: 'Windows TPM: Manufacturer version', key: 'tpm.manufacturer.version', type: 'зависимый', interval: '—', status: 'active', note: 'версия прошивки' },
        ]
      }
    ]
  },
  {
    id: 'prototype',
    title: '2. Прототипы элементов (по правилам обнаружения)',
    groups: [
      {
        id: 'lld-fs',
        name: 'LLD: Mounted filesystem discovery — vfs.fs.get[short] · правило АКТИВНО',
        items: [
          { id: 'p1', name: 'FS [{#FSLABEL}({#FSNAME})]: Get data', key: 'vfs.fs.get[full,{#FSNAME}]', type: 'агент', interval: '1m', status: 'active', note: 'МАСТЕР на каждый том', isMaster: true },
          { id: 'p2', name: 'FS […]: Space: Available', key: 'vfs.fs.dependent.size[{#FSNAME},free]', type: 'зависимый', interval: '—', status: 'active', note: 'свободно, Б' },
          { id: 'p3', name: 'FS […]: Space: Available, in %', key: 'vfs.fs.dependent.size[{#FSNAME},pfree]', type: 'зависимый', interval: '—', status: 'active', note: 'свободно, %' },
          { id: 'p4', name: 'FS […]: Space: Used, in %', key: 'vfs.fs.dependent.size[{#FSNAME},pused]', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'мало / критически мало места (WARN/AVG)' },
          { id: 'p5', name: 'FS […]: Space: Total', key: 'vfs.fs.dependent.size[{#FSNAME},total]', type: 'зависимый', interval: '—', status: 'active', note: 'всего, Б' },
          { id: 'p6', name: 'FS […]: Space: Used', key: 'vfs.fs.dependent.size[{#FSNAME},used]', type: 'зависимый', interval: '—', status: 'active', note: 'занято, Б' },
        ]
      },
      {
        id: 'lld-disk',
        name: 'LLD: Physical disks discovery — perf_instance_en.discovery[PhysicalDisk] · правило АКТИВНО',
        items: [
          { id: 'p7', name: '{#DEVNAME}: Disk utilization by idle time', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\% Idle Time",60]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'диск перегружен (WARN)' },
          { id: 'p8', name: '{#DEVNAME}: Disk read rate', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Disk Reads/sec",60]', type: 'агент', interval: '1m', status: 'active', note: 'чтений/с' },
          { id: 'p9', name: '{#DEVNAME}: Disk write rate', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Disk Writes/sec",60]', type: 'агент', interval: '1m', status: 'active', note: 'записей/с' },
          { id: 'p10', name: '{#DEVNAME}: Disk read request avg waiting time', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Avg. Disk sec/Read",60]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'отклик чтения высокий (WARN)' },
          { id: 'p11', name: '{#DEVNAME}: Disk write request avg waiting time', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Avg. Disk sec/Write",60]', type: 'агент', interval: '1m', status: 'active', note: '', hasTrigger: true, triggerNote: 'отклик записи высокий (WARN)' },
          { id: 'p12', name: '{#DEVNAME}: Average disk read queue length', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Avg. Disk Read Queue Length",60]', type: 'агент', interval: '1m', status: 'active', note: 'очередь чтения' },
          { id: 'p13', name: '{#DEVNAME}: Average disk write queue length', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Avg. Disk Write Queue Length",60]', type: 'агент', interval: '1m', status: 'active', note: 'очередь записи' },
          { id: 'p14', name: '{#DEVNAME}: Disk average queue size (avgqu-sz)', key: 'perf_counter_en["\\PhysicalDisk({#DEVNAME})\\Current Disk Queue Length",60]', type: 'агент', interval: '1m', status: 'active', note: 'текущая очередь' },
        ]
      },
      {
        id: 'lld-net',
        name: 'LLD: Network interfaces discovery · правило АКТИВНО',
        items: [
          { id: 'p15', name: 'Interface {#IFNAME}({#IFALIAS}): Bits received', key: 'net.if.in["{#IFGUID}"]', type: 'агент', interval: '3m', status: 'active', note: 'входящий трафик' },
          { id: 'p16', name: 'Interface {#IFNAME}({#IFALIAS}): Bits sent', key: 'net.if.out["{#IFGUID}"]', type: 'агент', interval: '3m', status: 'active', note: 'исходящий трафик' },
          { id: 'p17', name: 'Interface …: Inbound packets discarded', key: 'net.if.in["{#IFGUID}",dropped]', type: 'агент', interval: '3m', status: 'active', note: 'входящие отброшенные' },
          { id: 'p18', name: 'Interface …: Inbound packets with errors', key: 'net.if.in["{#IFGUID}",errors]', type: 'агент', interval: '3m', status: 'active', note: '', hasTrigger: true, triggerNote: 'высокий error rate (WARN, уровень правила)' },
          { id: 'p19', name: 'Interface …: Outbound packets discarded', key: 'net.if.out["{#IFGUID}",dropped]', type: 'агент', interval: '3m', status: 'active', note: 'исходящие отброшенные' },
          { id: 'p20', name: 'Interface …: Outbound packets with errors', key: 'net.if.out["{#IFGUID}",errors]', type: 'агент', interval: '3m', status: 'active', note: '', hasTrigger: true, triggerNote: 'высокий error rate (WARN, уровень правила)' },
          { id: 'p21', name: 'Interface …: Speed', key: 'net.if.speed["{#IFGUID}"]', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'скорость упала (INFO, уровень правила)' },
          { id: 'p22', name: 'Interface …: Operational status', key: 'net.if.status["{#IFGUID}"]', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'link down (AVG)' },
          { id: 'p23', name: 'Interface …: Interface type', key: 'net.if.type["{#IFGUID}"]', type: 'зависимый', interval: '—', status: 'active', note: 'тип интерфейса' },
        ]
      },
      {
        id: 'lld-fw',
        name: 'LLD: Windows Firewall profiles discovery · правило АКТИВНО',
        items: [
          { id: 'p24', name: 'Windows Firewall [{#FW.PROFILE}]: Enabled', key: 'firewall.enabled["{#FW.PROFILE}"]', type: 'зависимый', interval: '—', status: 'active', note: '', hasTrigger: true, triggerNote: 'профиль выключен (WARN)' },
          { id: 'p25', name: 'Windows Firewall [{#FW.PROFILE}]: Default inbound action', key: 'firewall.inbound["{#FW.PROFILE}"]', type: 'зависимый', interval: '—', status: 'active', note: 'действие по умолчанию (вход)' },
          { id: 'p26', name: 'Windows Firewall [{#FW.PROFILE}]: Default outbound action', key: 'firewall.outbound["{#FW.PROFILE}"]', type: 'зависимый', interval: '—', status: 'active', note: 'действие по умолчанию (выход)' },
        ]
      },
      {
        id: 'lld-bl',
        name: 'LLD: Windows BitLocker volume discovery · правило ОТКЛЮЧЕНО',
        items: [
          { id: 'p27', name: 'BitLocker [{#FSNAME}]: Conversion status', key: 'bitlocker.conversion["{#FSNAME}"]', type: 'зависимый', interval: '—', status: 'disabled', note: 'статус конверсии' },
          { id: 'p28', name: 'BitLocker [{#FSNAME}]: Encryption method', key: 'bitlocker.method["{#FSNAME}"]', type: 'зависимый', interval: '—', status: 'disabled', note: 'метод шифрования' },
          { id: 'p29', name: 'BitLocker [{#FSNAME}]: Protection status', key: 'bitlocker.protection["{#FSNAME}"]', type: 'зависимый', interval: '—', status: 'disabled', note: '', hasTrigger: true, triggerNote: '(откл.) защита не включена на enforced-томе' },
        ]
      },
      {
        id: 'lld-svc',
        name: 'LLD: Windows services discovery · правило ОТКЛЮЧЕНО',
        items: [
          { id: 'p30', name: 'State of service "{#SERVICE.NAME}" ({#SERVICE.DISPLAYNAME})', key: 'service.info["{#SERVICE.NAME}",state]', type: 'агент', interval: '1m', status: 'disabled', note: '', hasTrigger: true, triggerNote: '(откл.) не запущена / не должна работать' },
        ]
      },
      {
        id: 'lld-tasks',
        name: 'LLD: Windows scheduled tasks discovery · правило ОТКЛЮЧЕНО',
        items: [
          { id: 'p31', name: 'Scheduled task [{#TASK.PATH}{#TASK.NAME}]: State', key: 'task.state["{#TASK.URI}"]', type: 'зависимый', interval: '—', status: 'disabled', note: '', hasTrigger: true, triggerNote: '(откл.) задача выключена' },
        ]
      }
    ]
  }
];
