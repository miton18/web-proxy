// ----------------------------------------------------------------------------
// requirements
const Joi = require('joi');

// ----------------------------------------------------------------------------
// regex
const ipv4 = (
  /^((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])$/
);

const ipv6 = new RegExp(
  `([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|
  ([0-9a-fA-F]{1,4}:){1,7}:|
  ([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|
  ([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|
  ([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|
  ([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|
  ([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|
  [0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|
  :((:[0-9a-fA-F]{1,4}){1,7}|:)|::|
  fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|
  ::(ffff(:0{1,4}){0,1}:){0,1}
  ((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}
  (25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|
  ([0-9a-fA-F]{1,4}:){1,4}:
  ((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}
  (25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])`
);

// ----------------------------------------------------------------------------
// create model
const DockerModel = Joi.object().keys({
  name: Joi.string().regex(/\/?[a-zA-Z0-9_-]+/),
  Hostname: Joi.string(),
  Domainname: Joi.string(),
  User: Joi.string(),
  Env: Joi.array().items(Joi.string().regex(/^[\w\d_]+=[\w\d_]+$/i)),
  Image: Joi.string().regex(/^([\w\d_\-\.]+\/)?[\w\d_\-\.]+:[\w\d_\-\.]+$/i).required(),
  Labels: Joi.object(),
  Volumes: Joi.object(),
  WorkindDir: Joi.string(),
  ExposedPorts: Joi.object(),
  HostConfig: Joi.object().keys({
    Binds: Joi.array().items(Joi.string().regex(/^[\/\w\d\.\-\_ ]+:[\/\w\d\.\-\_ ]+$/i)),
    Links: Joi.array().items(Joi.string().regex(/^[\w\d]+:[\w\d]+$/i)),
    Memory: Joi.number().min(0),
    MemorySwap: Joi.number().min(0),
    MemoryReservation: Joi.number().min(0),
    KernelMemory: Joi.number().min(0),
    CpuPercent: Joi.number().min(0).max(100),
    CpuShares: Joi.number().min(0),
    CpuPeriod: Joi.number().min(0),
    CpuQuota: Joi.number().min(0),
    CpusetCpus: Joi.string().regex(/^((\d,)+)?\d$/i),
    CpusetMems: Joi.string().regex(/^((\d,)+)?\d$/i),
    IOMaximumBandwidth: Joi.number().min(0),
    IOMaximumIOps: Joi.number().min(0),
    BlkioWeight: Joi.number().min(0),
    BlkioWeightDevice: Joi.array().items(Joi.object()),
    BlkioDeviceReadBps: Joi.array().items(Joi.object()),
    BlkioDeviceReadIOps: Joi.array().items(Joi.object()),
    BlkioDeviceWriteBps: Joi.array().items(Joi.object()),
    BlkioDeviceWriteIOps: Joi.array().items(Joi.object()),
    MemorySwappiness: Joi.number().min(0),
    OomKillDisable: Joi.boolean(),
    OomScoreAdj: Joi.number(),
    PidMode: Joi.string(),
    PidsLimit: Joi.number(),
    PortBindings: Joi.object(),
    PublishAllPorts: Joi.boolean(),
    Privileged: Joi.boolean(),
    ReadonlyRootfs: Joi.boolean(),
    Dns: Joi.array().items(Joi.string().regex(ipv4)),
    DnsOptions: Joi.array().items(Joi.string()),
    DnsSearch: Joi.array().items(Joi.string()),
    ExtraHosts: Joi.any(),
    VolumesFrom: Joi.array().items(Joi.string().regex(/^[\w\d_\-]+(:ro|:rw)?$/i)),
    CapAdd: Joi.array().items(Joi.string()),
    CapDrop: Joi.array().items(Joi.string()),
    GroupAdd: Joi.array().items(Joi.string()),
    RestartPolicy: Joi.object().keys({
      Name: Joi.string().required(),
      MaximumRetryCount: Joi.number().required()
    }),

    NetworkMode: Joi.string(),
    Devices: Joi.array().items(Joi.any()),
    Sysctls: Joi.object(),
    Ulimits: Joi.array().items(Joi.object()),
    LogConfig: Joi.object().keys({
      Type: Joi.string().required(),
      Config: Joi.object()
    }),

    SecurityOpt: Joi.array().items(Joi.any()),
    StorageOpt: Joi.object(),
    CgroupParent: Joi.string(),
    VolumeDriver: Joi.string(),
    ShmSize: Joi.number()
  }),

  NetworkingConfig: Joi.object().keys({
    EndpointsConfig: Joi.object().required().keys({
      isolated_nw: Joi.object().required().keys({
        IPAMConfig: Joi.object().keys({
          IPv4Address: Joi.string().regex(ipv4),
          IPv6Address: Joi.string().regex(ipv6),
          LinkLocalIPs: Joi.array().items(
            Joi.string().regex(ipv4),
            Joi.string().regex(ipv6)
          )
        }),

        Links: Joi.array().items(Joi.string()),
        Aliases: Joi.array().items(Joi.string())
      })
    })
  })
});

// ----------------------------------------------------------------------------
// exports
module.exports = {
  DockerModel
};
