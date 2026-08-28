/** Generated from openapi.json. Do not edit manually. */
export const operationSchemas = {
  "updateApiKeyEnabled": {
    "method": "PUT",
    "path": "/inapi/v2/apikey/enabled",
    "auth": "management",
    "request": {
      "body": {
        "type": "object",
        "properties": {
          "key": {
            "type": "string",
            "description": "要操作的 API Key 值，格式为 `sk-` 开头的字符串",
            "example": "sk-2019c55114cdb233bd2202c9273d4cc677ec76b04682a4b2ebbc11ab316636e2"
          },
          "enabled": {
            "type": "boolean",
            "description": "目标启用状态。`true` 为启用，`false` 为禁用",
            "example": false
          }
        },
        "required": [
          "key",
          "enabled"
        ]
      }
    },
    "response": {
      "title": "",
      "type": "object",
      "properties": {
        "status": {
          "type": "boolean",
          "description": "操作是否成功，`true` 表示成功",
          "example": true
        },
        "data": {
          "type": "object",
          "properties": {},
          "description": "无实际数据，操作结果以 `status` 字段为准"
        }
      },
      "required": [
        "status",
        "data"
      ]
    }
  },
  "deleteApiKey": {
    "method": "DELETE",
    "path": "/inapi/v2/apikey",
    "auth": "management",
    "request": {
      "body": {
        "type": "object",
        "properties": {
          "key": {
            "type": "string",
            "description": "要删除的 API Key 完整值，必须为已禁用状态的 Key"
          }
        },
        "required": [
          "key"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "status": {
          "type": "boolean",
          "description": "操作是否成功，`true` 表示已成功删除",
          "example": true
        },
        "data": {
          "type": "object",
          "properties": {},
          "description": "无实际数据，操作结果以 `status` 字段为准"
        }
      },
      "required": [
        "status",
        "data"
      ]
    }
  },
  "createApiKey": {
    "method": "POST",
    "path": "/inapi/v2/apikey",
    "auth": "management",
    "request": {
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "description": "允许为空，如果传入member代表创建vip订阅专用apikey",
            "nullable": true
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "status": {
          "type": "boolean"
        },
        "data": {
          "type": "object",
          "properties": {
            "key": {
              "type": "string",
              "description": "新创建的 API Key 完整值（格式：`sk-` 开头）。**此为唯一一次返回完整 Key，请立即保存，后续无法再次获取**",
              "example": "sk-2019c55114cdb233bd2202c9273d4cc677ec76b04682a4b2ebbc11ab316636e2"
            },
            "name": {
              "type": "string",
              "description": "API Key 的名称标签",
              "example": "我的生产环境 Key"
            },
            "createdAt": {
              "type": "string",
              "description": "Key 的创建时间，ISO 8601 格式",
              "example": "2026-01-01T00:00:00+08:00"
            },
            "enabled": {
              "type": "boolean",
              "description": "Key 的当前启用状态，新创建的 Key 默认为 `true`（已启用）",
              "example": true
            }
          },
          "required": [
            "key",
            "name",
            "createdAt",
            "enabled"
          ]
        }
      },
      "required": [
        "status",
        "data"
      ]
    }
  },
  "listApiKeys": {
    "method": "GET",
    "path": "/inapi/v3/apikeys",
    "auth": "management",
    "request": {},
    "response": {
      "type": "object",
      "properties": {
        "status": {
          "type": "boolean",
          "description": "请求是否成功",
          "example": true
        },
        "data": {
          "type": "array",
          "description": "API Key 列表",
          "items": {
            "type": "object",
            "properties": {
              "key": {
                "type": "string",
                "description": "API Key 值（已脱敏，仅保留前后部分字符）",
                "example": "sk-2019c5***36e2"
              },
              "name": {
                "type": "string",
                "description": "API Key 的名称标签",
                "example": "我的生产环境 Key"
              },
              "createdAt": {
                "type": "string",
                "description": "Key 的创建时间，ISO 8601 格式",
                "example": "2026-01-01T00:00:00+08:00"
              },
              "lastUsed": {
                "type": "string",
                "description": "Key 最近一次被使用的时间，ISO 8601 格式；若从未使用则为空字符串",
                "example": "2026-04-01T12:30:00+08:00"
              },
              "enabled": {
                "type": "boolean",
                "description": "Key 当前的启用状态，`true` 为已启用，`false` 为已禁用",
                "example": true
              },
              "totalTokens": {
                "type": "integer",
                "description": "Key 自创建以来累计消耗的 token 总量（所有模型合计）",
                "example": 1024000
              },
              "quota": {
                "type": "object",
                "description": "Key 的用量配额信息",
                "properties": {
                  "daily": {
                    "type": "object",
                    "description": "日配额信息",
                    "properties": {
                      "enabled": {
                        "type": "boolean",
                        "description": "日配额是否已启用"
                      },
                      "used": {
                        "type": "number",
                        "description": "今日已使用量"
                      },
                      "limit": {
                        "type": "number",
                        "description": "日使用上限，`-1` 表示未设限"
                      }
                    },
                    "required": [
                      "enabled",
                      "used",
                      "limit"
                    ]
                  },
                  "monthly": {
                    "type": "object",
                    "description": "月配额信息",
                    "properties": {
                      "enabled": {
                        "type": "boolean",
                        "description": "月配额是否已启用"
                      },
                      "used": {
                        "type": "number",
                        "description": "本月已使用量"
                      },
                      "limit": {
                        "type": "number",
                        "description": "月使用上限，`-1` 表示未设限"
                      }
                    },
                    "required": [
                      "enabled",
                      "used",
                      "limit"
                    ]
                  },
                  "total": {
                    "type": "object",
                    "description": "累计总配额信息",
                    "properties": {
                      "enables": {
                        "type": "boolean",
                        "description": "总配额是否已启用"
                      },
                      "used": {
                        "type": "number",
                        "description": "累计已使用总量"
                      },
                      "limit": {
                        "type": "number",
                        "description": "累计使用上限，`-1` 表示未设限"
                      }
                    },
                    "required": [
                      "enables",
                      "used",
                      "limit"
                    ]
                  }
                },
                "required": [
                  "daily",
                  "monthly",
                  "total"
                ]
              }
            },
            "required": [
              "key",
              "name",
              "createdAt",
              "lastUsed",
              "enabled",
              "totalTokens",
              "quota"
            ]
          }
        }
      },
      "required": [
        "status",
        "data"
      ]
    }
  },
  "updateApiKeyName": {
    "method": "PUT",
    "path": "/inapi/v2/apikey/name",
    "auth": "management",
    "request": {
      "body": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "description": "API Key 的新名称，长度 1 到 20 个字符",
            "minLength": 1,
            "maxLength": 20
          },
          "key": {
            "type": "string",
            "description": "要修改名称的 API Key 完整值"
          }
        },
        "required": [
          "name",
          "key"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {}
    }
  },
  "updateApiKeyQuota": {
    "method": "PUT",
    "path": "/inapi/v2/apikey/quota/{api_key}",
    "auth": "management",
    "request": {
      "path": {
        "type": "object",
        "properties": {
          "api_key": {
            "type": "string",
            "example": "sk-2019c55114cdb233bd2202c9273d4cc677ec76b04682a4b2ebbc11ab316636e2"
          }
        },
        "required": [
          "api_key"
        ]
      },
      "body": {
        "type": "object",
        "description": "限额配置对象，三种限额均为可选，按需传入",
        "properties": {
          "daily_quota": {
            "type": "object",
            "description": "日限额配置，按自然日（UTC+8）计算，每日零点重置",
            "properties": {
              "enabled": {
                "type": "boolean",
                "description": "是否启用日限额"
              },
              "limit": {
                "type": "number",
                "description": "日用量上限（token 数量，单位：个）"
              },
              "alert_threshold": {
                "type": "number",
                "description": "告警触发阈值（百分比，0-100），达到该比例时发送告警通知"
              },
              "suppress_alert": {
                "type": "boolean",
                "description": "是否抑制告警通知，`true` 时即使触发阈值也不发送告警"
              }
            }
          },
          "monthly_quota": {
            "type": "object",
            "description": "月限额配置，按自然月（UTC+8）计算，每月 1 日零点重置",
            "properties": {
              "enabled": {
                "type": "boolean",
                "description": "是否启用月限额"
              },
              "limit": {
                "type": "number",
                "description": "月用量上限（token 数量，单位：个）"
              },
              "alert_threshold": {
                "type": "number",
                "description": "告警触发阈值（百分比，0-100），达到该比例时发送告警通知"
              },
              "suppress_alert": {
                "type": "boolean",
                "description": "是否抑制告警通知"
              }
            }
          },
          "total_quota": {
            "type": "object",
            "description": "累计总限额配置，从 Key 创建起累计计算，不重置",
            "properties": {
              "enabled": {
                "type": "boolean",
                "description": "是否启用总限额"
              },
              "limit": {
                "type": "number",
                "description": "累计用量上限（token 数量，单位：个）"
              },
              "alert_threshold": {
                "type": "number",
                "description": "告警触发阈值（百分比，0-100），达到该比例时发送告警通知"
              },
              "suppress_alert": {
                "type": "boolean",
                "description": "是否抑制告警通知"
              }
            }
          }
        }
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "status": {
          "type": "boolean",
          "description": "操作是否成功",
          "example": true
        },
        "data": {
          "type": "object",
          "description": "更新后的完整限额配置，包含 daily_quota、monthly_quota、total_quota 及时间戳",
          "properties": {
            "created_at": {
              "type": "string",
              "description": "限额配置的创建时间"
            },
            "updated_at": {
              "type": "string",
              "description": "限额配置的最后更新时间"
            }
          }
        }
      }
    }
  },
  "getBillByKey": {
    "method": "GET",
    "path": "/inapi/v3/stat/bill",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "month": {
            "type": "string",
            "pattern": "^\\d{4}-\\d{2}$",
            "example": "2025-11"
          },
          "api_key": {
            "type": "string",
            "example": "sk-xxxxx"
          }
        },
        "required": [
          "month"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "models": {
          "type": "array",
          "description": "按模型分组的账单数据",
          "items": {
            "type": "object",
            "description": "模型账单",
            "properties": {
              "model_id": {
                "type": "string",
                "description": "模型 ID",
                "example": "gpt-4"
              },
              "items": {
                "type": "array",
                "description": "该模型下的计费项列表",
                "items": {
                  "type": "object",
                  "description": "账单计费项详情",
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "计费项中文描述",
                      "example": "文本输入 tokens"
                    },
                    "usage": {
                      "type": "object",
                      "description": "用量信息",
                      "properties": {
                        "count": {
                          "type": "number",
                          "format": "float",
                          "description": "用量数值",
                          "example": 150.5
                        },
                        "unit": {
                          "type": "string",
                          "description": "用量单位",
                          "enum": [
                            "k/tokens",
                            "百字符",
                            "分钟",
                            "秒",
                            "次",
                            "张",
                            "default"
                          ],
                          "example": "k/tokens"
                        }
                      }
                    },
                    "fee": {
                      "type": "number",
                      "format": "float",
                      "description": "费用（人民币元）",
                      "example": 4.52
                    },
                    "key": {
                      "type": "string",
                      "description": "计费项key"
                    }
                  }
                }
              },
              "total_fee": {
                "type": "number",
                "format": "float",
                "description": "该模型下所有计费项的总费用（人民币元）",
                "example": 6.03
              },
              "total_requests": {
                "type": "integer"
              }
            }
          }
        }
      }
    }
  },
  "getBillAllKeys": {
    "method": "GET",
    "path": "/inapi/v3/stat/bill/all_keys",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "month": {
            "type": "string",
            "pattern": "^\\d{4}-\\d{2}$",
            "example": "2025-11"
          }
        },
        "required": [
          "month"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "api_keys": {
          "type": "array",
          "description": "按 API Key 分组的账单数据",
          "items": {
            "type": "object",
            "description": "单个 API Key 的账单数据",
            "properties": {
              "api_key": {
                "type": "string",
                "description": "API Key",
                "example": "sk-xxxxx"
              },
              "models": {
                "type": "array",
                "description": "按模型分组的账单数据",
                "items": {
                  "type": "object",
                  "description": "模型账单",
                  "properties": {
                    "model_id": {
                      "type": "string",
                      "description": "模型 ID",
                      "example": "gpt-4"
                    },
                    "items": {
                      "type": "array",
                      "description": "该模型下的计费项列表",
                      "items": {
                        "type": "object",
                        "description": "账单计费项详情",
                        "properties": {
                          "name": {
                            "type": "string",
                            "description": "计费项中文描述",
                            "example": "文本输入 tokens"
                          },
                          "usage": {
                            "type": "object",
                            "description": "用量信息",
                            "properties": {
                              "count": {
                                "type": "number",
                                "format": "float",
                                "description": "用量数值",
                                "example": 150.5
                              },
                              "unit": {
                                "type": "string",
                                "description": "用量单位",
                                "enum": [
                                  "k/tokens",
                                  "百字符",
                                  "分钟",
                                  "秒",
                                  "次",
                                  "张",
                                  "default"
                                ],
                                "example": "k/tokens"
                              }
                            }
                          },
                          "fee": {
                            "type": "number",
                            "format": "float",
                            "description": "费用（人民币元）",
                            "example": 4.52
                          },
                          "key": {
                            "type": "string",
                            "description": "计费项key"
                          }
                        }
                      }
                    },
                    "total_fee": {
                      "type": "number",
                      "format": "float",
                      "description": "该模型下所有计费项的总费用（人民币元）",
                      "example": 6.03
                    },
                    "total_requests": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "getBillByRange": {
    "method": "GET",
    "path": "/inapi/v3/stat/bill/range",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "start": {
            "type": "string",
            "format": "date-time",
            "example": "2025-11-01T00:00:00+08:00"
          },
          "end": {
            "type": "string",
            "format": "date-time",
            "example": "2025-11-30T23:59:59+08:00"
          },
          "grain": {
            "type": "string",
            "enum": [
              "month",
              "day",
              "hour",
              "five_minute",
              "minute"
            ],
            "example": "day"
          },
          "api_key": {
            "type": "string",
            "example": "sk-xxxxx"
          }
        },
        "required": [
          "start",
          "end",
          "grain"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "models": {
          "type": "array",
          "description": "按模型分组的时间序列账单数据",
          "items": {
            "type": "object",
            "description": "模型账单时间序列",
            "properties": {
              "model_id": {
                "type": "string",
                "description": "模型 ID",
                "example": "gpt-4"
              },
              "time_series": {
                "type": "array",
                "description": "时间序列数据",
                "items": {
                  "type": "object",
                  "description": "时间序列数据点",
                  "properties": {
                    "time": {
                      "type": "string",
                      "format": "date-time",
                      "description": "时间点，RFC3339 格式",
                      "example": "2025-11-01T00:00:00+08:00"
                    },
                    "items": {
                      "type": "array",
                      "description": "该时间点的计费项列表",
                      "items": {
                        "type": "object",
                        "description": "账单计费项详情",
                        "properties": {
                          "name": {
                            "type": "string",
                            "description": "计费项中文描述",
                            "example": "文本输入 tokens"
                          },
                          "usage": {
                            "type": "object",
                            "description": "用量信息",
                            "properties": {
                              "count": {
                                "type": "number",
                                "format": "float",
                                "description": "用量数值",
                                "example": 150.5
                              },
                              "unit": {
                                "type": "string",
                                "description": "用量单位",
                                "enum": [
                                  "k/tokens",
                                  "百字符",
                                  "分钟",
                                  "秒",
                                  "次",
                                  "张",
                                  "default"
                                ],
                                "example": "k/tokens"
                              }
                            }
                          },
                          "fee": {
                            "type": "number",
                            "format": "float",
                            "description": "费用（人民币元）",
                            "example": 4.52
                          },
                          "key": {
                            "type": "string",
                            "description": "计费项key"
                          }
                        }
                      }
                    },
                    "total_fee": {
                      "type": "number",
                      "format": "float",
                      "description": "该时间点的总费用（人民币元）",
                      "example": 3
                    },
                    "total_requests": {
                      "type": "integer"
                    }
                  }
                }
              },
              "total_fee": {
                "type": "number",
                "format": "float",
                "description": "整个时间序列的总费用（人民币元）",
                "example": 6.03
              },
              "total_requests": {
                "type": "integer"
              }
            }
          }
        }
      }
    }
  },
  "getBillAllKeysByRange": {
    "method": "GET",
    "path": "/inapi/v3/stat/bill/range/all_keys",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "start": {
            "type": "string",
            "format": "date-time",
            "example": "2025-11-01T00:00:00+08:00"
          },
          "end": {
            "type": "string",
            "format": "date-time",
            "example": "2025-11-30T23:59:59+08:00"
          },
          "grain": {
            "type": "string",
            "enum": [
              "month",
              "day",
              "hour",
              "five_minute",
              "minute"
            ],
            "example": "day"
          }
        },
        "required": [
          "start",
          "end",
          "grain"
        ]
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "api_keys": {
          "type": "array",
          "description": "按 API Key 分组的时间序列账单数据",
          "items": {
            "type": "object",
            "description": "单个 API Key 的时间序列账单数据",
            "properties": {
              "api_key": {
                "type": "string",
                "description": "API Key",
                "example": "sk-xxxxx"
              },
              "models": {
                "type": "array",
                "description": "按模型分组的时间序列账单数据",
                "items": {
                  "type": "object",
                  "description": "模型账单时间序列",
                  "properties": {
                    "model_id": {
                      "type": "string",
                      "description": "模型 ID",
                      "example": "gpt-4"
                    },
                    "time_series": {
                      "type": "array",
                      "description": "时间序列数据",
                      "items": {
                        "type": "object",
                        "description": "时间序列数据点",
                        "properties": {
                          "time": {
                            "type": "string",
                            "format": "date-time",
                            "description": "时间点，RFC3339 格式",
                            "example": "2025-11-01T00:00:00+08:00"
                          },
                          "items": {
                            "type": "array",
                            "description": "该时间点的计费项列表",
                            "items": {
                              "type": "object",
                              "description": "账单计费项详情",
                              "properties": {
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文描述",
                                  "example": "文本输入 tokens"
                                },
                                "usage": {
                                  "type": "object",
                                  "description": "用量信息",
                                  "properties": {
                                    "count": {
                                      "type": "number",
                                      "format": "float",
                                      "description": "用量数值",
                                      "example": 150.5
                                    },
                                    "unit": {
                                      "type": "string",
                                      "description": "用量单位",
                                      "enum": [
                                        "k/tokens",
                                        "百字符",
                                        "分钟",
                                        "秒",
                                        "次",
                                        "张",
                                        "default"
                                      ],
                                      "example": "k/tokens"
                                    }
                                  }
                                },
                                "fee": {
                                  "type": "number",
                                  "format": "float",
                                  "description": "费用（人民币元）",
                                  "example": 4.52
                                },
                                "key": {
                                  "type": "string",
                                  "description": "计费项key"
                                }
                              }
                            }
                          },
                          "total_fee": {
                            "type": "number",
                            "format": "float",
                            "description": "该时间点的总费用（人民币元）",
                            "example": 3
                          },
                          "total_requests": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    "total_fee": {
                      "type": "number",
                      "format": "float",
                      "description": "整个时间序列的总费用（人民币元）",
                      "example": 6.03
                    },
                    "total_requests": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "getLogs": {
    "method": "GET",
    "path": "/inapi/v3/stat/log",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "start": {
            "type": "string",
            "format": "date-time",
            "example": "2025-03-01T00:00:00+08:00"
          },
          "end": {
            "type": "string",
            "format": "date-time",
            "example": "2025-03-02T00:00:00+08:00"
          },
          "page": {
            "type": "integer",
            "minimum": 1,
            "example": 1
          },
          "page_size": {
            "type": "integer",
            "minimum": 1,
            "maximum": 100,
            "example": 20
          },
          "model": {
            "type": "string",
            "example": "gpt-4o"
          },
          "code": {
            "type": "integer",
            "example": 200
          },
          "status": {
            "type": "string",
            "enum": [
              "success",
              "failure",
              "client_error",
              "server_error"
            ],
            "example": "success"
          },
          "apikey": {
            "type": "string",
            "example": "sk-abc123"
          },
          "server_type": {
            "type": "string",
            "enum": [
              "chat",
              "image",
              "video"
            ],
            "default": "chat",
            "example": "chat"
          },
          "id": {
            "type": "string"
          }
        },
        "required": [
          "page",
          "page_size"
        ]
      }
    },
    "response": {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "status": {
              "type": "boolean"
            }
          }
        },
        {
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "properties": {
                "items": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "description": "单条日志摘要（列表场景）",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "请求 ID，前缀决定类型（chatcmpl- / chatimage- / qvideo-）",
                        "example": "chatcmpl-abc123"
                      },
                      "model_id": {
                        "type": "string",
                        "description": "模型 ID",
                        "example": "gpt-4o"
                      },
                      "api_key": {
                        "type": "string",
                        "description": "API Key（已脱敏，格式 xxx-ab***cdef）",
                        "example": "sk-ab***c123"
                      },
                      "start_time": {
                        "type": "string",
                        "format": "date-time",
                        "description": "请求开始时间",
                        "example": "2025-03-01T10:00:00.000+08:00"
                      },
                      "end_time": {
                        "type": "string",
                        "format": "date-time",
                        "description": "请求结束时间",
                        "example": "2025-03-01T10:00:02.345+08:00"
                      },
                      "server_type": {
                        "type": "string",
                        "enum": [
                          "chat",
                          "image",
                          "video"
                        ],
                        "description": "日志来源类型",
                        "example": "chat"
                      },
                      "code": {
                        "type": "integer",
                        "description": "HTTP 状态码",
                        "example": 200
                      },
                      "errors": {
                        "type": "array",
                        "items": {
                          "type": "string"
                        },
                        "description": "错误信息列表，成功时为空数组",
                        "example": []
                      },
                      "state": {
                        "type": "string",
                        "description": "请求状态（success / fail）",
                        "example": "success"
                      },
                      "usage": {
                        "type": "object",
                        "additionalProperties": {
                          "type": "integer"
                        },
                        "description": "用量信息（key 为计费项名称，value 为数量）",
                        "properties": {},
                        "example": {
                          "input": 512,
                          "output": 128
                        }
                      },
                      "bo_usage": {
                        "type": "object",
                        "properties": {},
                        "description": "key为计费key，value为用量"
                      }
                    },
                    "required": [
                      "bo_usage"
                    ]
                  }
                },
                "total": {
                  "type": "integer",
                  "format": "int64",
                  "description": "满足条件的总条数",
                  "example": 100
                },
                "page": {
                  "type": "integer",
                  "description": "当前页码",
                  "example": 1
                },
                "page_size": {
                  "type": "integer",
                  "description": "每页条数",
                  "example": 20
                },
                "total_pages": {
                  "type": "integer",
                  "description": "总页数",
                  "example": 5
                }
              }
            }
          }
        }
      ]
    }
  },
  "getLogDetail": {
    "method": "GET",
    "path": "/inapi/v3/stat/log/detail",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "request_id": {
            "type": "string",
            "example": "chatcmpl-abc123def456"
          }
        },
        "required": [
          "request_id"
        ]
      }
    },
    "response": {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "status": {
              "type": "boolean"
            }
          }
        },
        {
          "type": "object",
          "properties": {
            "data": {
              "type": "object",
              "description": "对话日志详情（request_id 前缀 chatcmpl-）",
              "properties": {
                "id": {
                  "type": "string",
                  "example": "chatcmpl-abc123def456"
                },
                "state": {
                  "type": "string",
                  "enum": [
                    "success",
                    "fail"
                  ],
                  "example": "success"
                },
                "code": {
                  "type": "integer",
                  "example": 200
                },
                "server_type": {
                  "type": "string",
                  "example": "chat"
                },
                "start_time": {
                  "type": "string",
                  "format": "date-time",
                  "example": "2025-03-01T10:00:00.000+08:00"
                },
                "end_time": {
                  "type": "string",
                  "format": "date-time",
                  "example": "2025-03-01T10:00:02.345+08:00"
                },
                "original_model": {
                  "type": "string",
                  "description": "用户请求的原始模型名",
                  "example": "gpt-4o"
                },
                "errors": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "example": []
                },
                "cost_time": {
                  "type": "object",
                  "description": "各阶段耗时（毫秒）",
                  "properties": {
                    "last_req_upstream": {
                      "type": "integer",
                      "format": "int64",
                      "description": "收到请求到请求上游的耗时（ms）",
                      "example": 50
                    },
                    "ttft": {
                      "type": "integer",
                      "format": "int64",
                      "description": "收到请求到首字返回的耗时（ms）",
                      "example": 320
                    },
                    "latency": {
                      "type": "integer",
                      "format": "int64",
                      "description": "收到请求到断开连接的总耗时（ms）",
                      "example": 2345
                    }
                  }
                },
                "user": {
                  "type": "object",
                  "description": "用户信息（不含 API Key）",
                  "properties": {
                    "uid": {
                      "type": "string",
                      "example": "12345"
                    },
                    "user_agent": {
                      "type": "string",
                      "example": "Mozilla/5.0"
                    },
                    "client_ip": {
                      "type": "string",
                      "example": "1.2.3.4"
                    },
                    "referer": {
                      "type": "string",
                      "example": ""
                    },
                    "group": {
                      "type": "string",
                      "example": ""
                    }
                  }
                },
                "chat_request": {
                  "type": "object",
                  "properties": {},
                  "description": "（当前隐藏）原始请求体（relay_form 等，结构因模型类型而异）"
                },
                "chat_response": {
                  "type": "object",
                  "properties": {},
                  "description": "（当前隐藏）响应摘要（relay_stream_response 等，结构因模型类型而异）"
                }
              }
            }
          }
        }
      ]
    }
  },
  "getUsage": {
    "method": "GET",
    "path": "/inapi/v3/stat/new",
    "auth": "management",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "start": {
            "type": "string",
            "format": "date-time",
            "example": "2025-11-01T00:00:00+08:00"
          },
          "end": {
            "type": "string",
            "format": "date-time",
            "example": "2025-11-30T23:59:59+08:00"
          },
          "g": {
            "type": "string",
            "enum": [
              "month",
              "day",
              "hour",
              "five_minute",
              "minute"
            ],
            "example": "day"
          },
          "api_key": {
            "type": "string",
            "example": "sk-xxxxx"
          }
        }
      }
    },
    "response": {
      "type": "object",
      "properties": {
        "status": {
          "type": "boolean"
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "name": {
                      "type": "string"
                    },
                    "unit": {
                      "type": "string"
                    },
                    "total": {
                      "type": "number"
                    },
                    "values": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "time": {
                            "type": "string"
                          },
                          "value": {
                            "type": "number"
                          }
                        },
                        "required": [
                          "time",
                          "value"
                        ]
                      }
                    }
                  },
                  "required": [
                    "name",
                    "unit",
                    "total",
                    "values"
                  ]
                }
              }
            },
            "required": [
              "name",
              "items"
            ]
          }
        }
      },
      "required": [
        "status",
        "data"
      ]
    }
  },
  "getPricingItems": {
    "method": "GET",
    "path": "/inapi/v3/market/pricingitems",
    "auth": "management",
    "request": {},
    "response": {
      "type": "object",
      "properties": {}
    }
  },
  "getMarketModels": {
    "method": "GET",
    "path": "/v1/market/models",
    "auth": "public",
    "request": {
      "query": {
        "type": "object",
        "properties": {
          "sort": {
            "type": "string",
            "enum": [
              "rank",
              "id"
            ],
            "example": "rank"
          },
          "order": {
            "type": "string",
            "enum": [
              "asc",
              "desc"
            ],
            "example": "desc"
          },
          "overseas": {
            "type": "string",
            "enum": [
              "true",
              "false"
            ],
            "default": "false"
          }
        }
      }
    },
    "response": {
      "type": "object",
      "required": [
        "status",
        "data"
      ],
      "properties": {
        "status": {
          "type": "boolean",
          "example": true
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "id",
              "name",
              "description",
              "created_time",
              "avatar",
              "hot_tags",
              "features",
              "private",
              "model_constraints",
              "issuer",
              "architecture",
              "pricing_rules",
              "rate_limit",
              "model_filing",
              "supported_parameters",
              "support_api_protocols",
              "rank",
              "retirement_at",
              "release_at",
              "suggested_model"
            ],
            "properties": {
              "id": {
                "type": "string",
                "description": "模型唯一标识",
                "example": "gpt-4o"
              },
              "name": {
                "type": "string",
                "description": "模型名称",
                "example": "GPT-4o"
              },
              "description": {
                "type": "string",
                "description": "模型描述",
                "example": "OpenAI 最新的多模态模型"
              },
              "created_time": {
                "type": "string",
                "description": "模型创建时间",
                "example": "2024-05-13"
              },
              "avatar": {
                "type": "string",
                "description": "模型图标 URL",
                "example": ""
              },
              "hot_tags": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "热门标签",
                "example": [
                  "多模态",
                  "长上下文"
                ]
              },
              "features": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "功能特性",
                "example": [
                  "文本生成",
                  "图片理解"
                ]
              },
              "private": {
                "type": "boolean",
                "description": "是否为私有模型",
                "example": false
              },
              "model_constraints": {
                "type": "object",
                "description": "模型约束参数",
                "required": [
                  "context_length",
                  "max_completion_tokens",
                  "max_tokens",
                  "max_default_completion_tokens",
                  "max_chain_of_thought_length"
                ],
                "properties": {
                  "context_length": {
                    "type": "integer",
                    "description": "模型上下文长度",
                    "example": 128000
                  },
                  "max_completion_tokens": {
                    "type": "integer",
                    "description": "模型最大输出 token 数",
                    "example": 16384
                  },
                  "max_tokens": {
                    "type": "integer",
                    "description": "模型最大输出 token 数（与 max_completion_tokens 可能存在差异）",
                    "example": 16384
                  },
                  "max_default_completion_tokens": {
                    "type": "integer",
                    "description": "模型默认最大输出 token 数",
                    "example": 4096
                  },
                  "max_chain_of_thought_length": {
                    "type": "integer",
                    "description": "模型最大思考链长度",
                    "example": 0
                  }
                }
              },
              "issuer": {
                "type": "object",
                "description": "模型发行方",
                "required": [
                  "name",
                  "avatar"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "发行方名称",
                    "example": "OpenAI"
                  },
                  "avatar": {
                    "type": "string",
                    "description": "发行方图标 URL",
                    "example": ""
                  },
                  "model_page": {
                    "type": "string",
                    "description": "模型主页链接",
                    "nullable": true
                  }
                }
              },
              "architecture": {
                "type": "object",
                "description": "模型架构信息",
                "required": [
                  "input_modalities",
                  "output_modalities"
                ],
                "properties": {
                  "input_modalities": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "输入模态列表",
                    "example": [
                      "text",
                      "image"
                    ]
                  },
                  "output_modalities": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "输出模态列表",
                    "example": [
                      "text"
                    ]
                  },
                  "schema_output": {
                    "type": "object",
                    "description": "模型能力标记",
                    "required": [
                      "supported"
                    ],
                    "properties": {
                      "supported": {
                        "type": "boolean",
                        "description": "是否支持该能力",
                        "example": true
                      },
                      "description": {
                        "type": "string",
                        "description": "能力描述（支持 Markdown 格式）"
                      }
                    }
                  },
                  "function_calling": {
                    "type": "object",
                    "description": "模型能力标记",
                    "required": [
                      "supported"
                    ],
                    "properties": {
                      "supported": {
                        "type": "boolean",
                        "description": "是否支持该能力",
                        "example": true
                      },
                      "description": {
                        "type": "string",
                        "description": "能力描述（支持 Markdown 格式）"
                      }
                    }
                  },
                  "reasoning": {
                    "type": "object",
                    "description": "模型能力标记",
                    "required": [
                      "supported"
                    ],
                    "properties": {
                      "supported": {
                        "type": "boolean",
                        "description": "是否支持该能力",
                        "example": true
                      },
                      "description": {
                        "type": "string",
                        "description": "能力描述（支持 Markdown 格式）"
                      }
                    }
                  },
                  "content_cache": {
                    "type": "object",
                    "description": "模型能力标记",
                    "required": [
                      "supported"
                    ],
                    "properties": {
                      "supported": {
                        "type": "boolean",
                        "description": "是否支持该能力",
                        "example": true
                      },
                      "description": {
                        "type": "string",
                        "description": "能力描述（支持 Markdown 格式）"
                      }
                    }
                  }
                }
              },
              "pricing_rules": {
                "type": "array",
                "items": {
                  "type": "object",
                  "description": "定价规则",
                  "required": [
                    "input_range",
                    "output_range",
                    "input_item_type",
                    "output_item_type",
                    "details",
                    "details_v2"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "成本渠道名称（仅成本项使用）",
                      "nullable": true
                    },
                    "input_range": {
                      "type": "array",
                      "items": {
                        "type": "integer",
                        "format": "int64"
                      },
                      "description": "输入区间左右边界，`-1` 表示无上限",
                      "example": [
                        0,
                        -1
                      ]
                    },
                    "output_range": {
                      "type": "array",
                      "items": {
                        "type": "integer",
                        "format": "int64"
                      },
                      "description": "输出区间左右边界，`-1` 表示无上限",
                      "example": [
                        0,
                        -1
                      ]
                    },
                    "input_item_type": {
                      "type": "string",
                      "description": "输入计费项类型",
                      "example": "token"
                    },
                    "output_item_type": {
                      "type": "string",
                      "description": "输出计费项类型",
                      "example": "token"
                    },
                    "details": {
                      "deprecated": true,
                      "type": "object",
                      "description": "用量计费明细（V1 格式）。\n包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、\ncompletion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens\n等多种计费项，每个字段均为 PricingMode 类型。\n",
                      "properties": {
                        "total_prompt_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "total_completion_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "prompt_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "completion_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "reasoning_prompt_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "reasoning_completion_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "tts_bytes": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "asr_minutes": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "image_req_count": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "cached_hit": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "cache_storage": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "details_v2": {
                      "type": "object",
                      "description": "用量计费明细（V2 格式）。\n包含 input、output、cache、th_input、th_output 等计费项，\n每个字段均为 PricingItem 类型。\n",
                      "properties": {
                        "input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "cache": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "th_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "th_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "nth_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "nth_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "i_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "i_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "a_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "a_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "v_duration": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "av_duration": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "minute": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "hbyte": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "req": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "description": "定价规则列表",
                "deprecated": true
              },
              "pricing_rules_v2": {
                "type": "array",
                "items": {
                  "type": "object",
                  "description": "定价规则",
                  "required": [
                    "input_range",
                    "output_range",
                    "input_item_type",
                    "output_item_type",
                    "details",
                    "details_v2"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "成本渠道名称（仅成本项使用）",
                      "nullable": true
                    },
                    "input_range": {
                      "type": "array",
                      "items": {
                        "type": "integer",
                        "format": "int64"
                      },
                      "description": "输入区间左右边界，`-1` 表示无上限",
                      "example": [
                        0,
                        -1
                      ]
                    },
                    "output_range": {
                      "type": "array",
                      "items": {
                        "type": "integer",
                        "format": "int64"
                      },
                      "description": "输出区间左右边界，`-1` 表示无上限",
                      "example": [
                        0,
                        -1
                      ]
                    },
                    "input_item_type": {
                      "type": "string",
                      "description": "输入计费项类型",
                      "example": "token"
                    },
                    "output_item_type": {
                      "type": "string",
                      "description": "输出计费项类型",
                      "example": "token"
                    },
                    "details": {
                      "deprecated": true,
                      "type": "object",
                      "description": "用量计费明细（V1 格式）。\n包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、\ncompletion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens\n等多种计费项，每个字段均为 PricingMode 类型。\n",
                      "properties": {
                        "total_prompt_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "total_completion_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "prompt_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "completion_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "reasoning_prompt_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "reasoning_completion_tokens": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "tts_bytes": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "asr_minutes": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "image_req_count": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "cached_hit": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        },
                        "cache_storage": {
                          "type": "object",
                          "description": "定价模式（区分实时推理和批量推理）",
                          "properties": {
                            "real_time": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            },
                            "batch": {
                              "type": "object",
                              "description": "定价详情项",
                              "required": [
                                "unit_name",
                                "unit_size",
                                "unit_price",
                                "unit_price_usd",
                                "name"
                              ],
                              "properties": {
                                "unit_name": {
                                  "type": "string",
                                  "description": "定价单位名称",
                                  "example": "token"
                                },
                                "unit_size": {
                                  "type": "integer",
                                  "format": "int64",
                                  "description": "定价单位量",
                                  "example": 1000
                                },
                                "unit_price": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（人民币）",
                                  "example": 0.05
                                },
                                "unit_price_usd": {
                                  "type": "number",
                                  "format": "double",
                                  "description": "每单位定价（美元）",
                                  "example": 0.005
                                },
                                "name": {
                                  "type": "string",
                                  "description": "计费项中文名称",
                                  "example": "输入"
                                }
                              }
                            }
                          }
                        }
                      }
                    },
                    "details_v2": {
                      "type": "object",
                      "description": "用量计费明细（V2 格式）。\n包含 input、output、cache、th_input、th_output 等计费项，\n每个字段均为 PricingItem 类型。\n",
                      "properties": {
                        "input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "cache": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "th_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "th_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "nth_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "nth_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "i_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "i_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "a_input": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "a_output": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "v_duration": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "av_duration": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "minute": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "hbyte": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        },
                        "req": {
                          "type": "object",
                          "description": "定价详情项",
                          "required": [
                            "unit_name",
                            "unit_size",
                            "unit_price",
                            "unit_price_usd",
                            "name"
                          ],
                          "properties": {
                            "unit_name": {
                              "type": "string",
                              "description": "定价单位名称",
                              "example": "token"
                            },
                            "unit_size": {
                              "type": "integer",
                              "format": "int64",
                              "description": "定价单位量",
                              "example": 1000
                            },
                            "unit_price": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（人民币）",
                              "example": 0.05
                            },
                            "unit_price_usd": {
                              "type": "number",
                              "format": "double",
                              "description": "每单位定价（美元）",
                              "example": 0.005
                            },
                            "name": {
                              "type": "string",
                              "description": "计费项中文名称",
                              "example": "输入"
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "description": "定价规则 V2 列表"
              },
              "rate_limit": {
                "type": "object",
                "properties": {},
                "description": "限流配置，key 为限流类型（rpm/tpm/ipm/qpm）",
                "additionalProperties": {
                  "type": "object",
                  "description": "限流项明细",
                  "required": [
                    "name",
                    "quantity",
                    "unit_name",
                    "unit_time"
                  ],
                  "properties": {
                    "name": {
                      "type": "string",
                      "description": "限流项名称",
                      "example": "RPM"
                    },
                    "quantity": {
                      "type": "integer",
                      "format": "int64",
                      "description": "限流数量",
                      "example": 10000
                    },
                    "unit_name": {
                      "type": "string",
                      "description": "限流单位名称",
                      "example": "requests"
                    },
                    "unit_time": {
                      "type": "integer",
                      "format": "int64",
                      "description": "限流单位时间（秒）",
                      "example": 60
                    }
                  }
                },
                "deprecated": true,
                "example": {
                  "rpm": {
                    "name": "RPM",
                    "quantity": 10000,
                    "unit_name": "requests",
                    "unit_time": 60
                  }
                }
              },
              "model_filing": {
                "type": "object",
                "description": "模型备案信息",
                "required": [
                  "filing_no"
                ],
                "properties": {
                  "filing_no": {
                    "type": "string",
                    "description": "模型备案号",
                    "example": ""
                  }
                }
              },
              "supported_parameters": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "支持的请求参数列表",
                "deprecated": true,
                "example": [
                  "temperature",
                  "top_p",
                  "max_tokens",
                  "stream"
                ]
              },
              "support_api_protocols": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "支持的 API 协议列表",
                "example": [
                  "openai",
                  "anthropic"
                ]
              },
              "rank": {
                "type": "integer",
                "description": "模型排序权重",
                "example": 100
              },
              "retirement_at": {
                "type": "string",
                "description": "模型退役时间（日期格式：2006-01-02），空字符串表示未设定",
                "example": ""
              },
              "release_at": {
                "type": "string",
                "description": "模型发布时间（日期格式：2006-01-02）",
                "example": "2024-05-13"
              },
              "suggested_model": {
                "type": "string",
                "description": "模型退役后建议使用的新模型 ID",
                "example": ""
              }
            }
          }
        }
      }
    }
  }
} as const
export type OperationName = keyof typeof operationSchemas
