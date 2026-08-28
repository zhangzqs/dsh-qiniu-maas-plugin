export interface paths {
    "/inapi/v2/apikey/enabled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 启用或禁用 API Key
         * @description 变更指定 API Key 的启用状态。
         *
         *     **使用说明：**
         *     - `enabled: true`：启用 API Key，启用后该 Key 可正常用于鉴权调用
         *     - `enabled: false`：禁用 API Key，禁用后该 Key 将立即失效，所有使用该 Key 的请求均会被拒绝
         *
         *     **注意事项：**
         *     - 禁用操作立即生效，请确认业务侧不再依赖该 Key 后再执行
         *     - 已禁用的 Key 可重新启用，历史用量记录不会丢失
         */
        put: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description 七牛 AK/SK 签名鉴权，格式：Bearer Qiniu &lt;AccessKey&gt;:&lt;EncodedSign&gt;
                     * @example Bearer Qiniu YOUR_ACCESS_KEY:BASE64_ENCODED_SIGN
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    "application/json": {
                        /**
                         * @description 要操作的 API Key 值，格式为 `sk-` 开头的字符串
                         * @example sk-2019c55114cdb233bd2202c9273d4cc677ec76b04682a4b2ebbc11ab316636e2
                         */
                        key: string;
                        /**
                         * @description 目标启用状态。`true` 为启用，`false` 为禁用
                         * @example false
                         */
                        enabled: boolean;
                    };
                };
            };
            responses: {
                /** @description 操作成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description 操作是否成功，`true` 表示成功
                             * @example true
                             */
                            status: boolean;
                            /** @description 无实际数据，操作结果以 `status` 字段为准 */
                            data: Record<string, never>;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v2/apikey": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * 创建 API Key
         * @description 创建一个新的 API Key，用于调用七牛 MaaS 平台的各类 AI 模型接口。
         *
         *     **字段说明：**
         *     - `name`：API Key 的名称标签，便于管理和区分，长度限制为 1 到 20 个字符
         *     - `type`：Key 类型，不传或为空时创建普通 API Key；传入 `member` 时创建 VIP 订阅专用 Key，该类型 Key 享有订阅计划内的专属资源配额
         *
         *     **返回结果：**
         *     - 创建成功后返回完整的 Key 信息，其中 `key` 字段即为鉴权时使用的 API Key 值（**仅在创建时完整返回，后续查询接口仅返回脱敏版本，请妥善保存**）
         */
        post: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description 七牛 AK/SK 签名鉴权，格式：Bearer Qiniu &lt;AccessKey&gt;:&lt;EncodedSign&gt;
                     * @example Bearer Qiniu YOUR_ACCESS_KEY:BASE64_ENCODED_SIGN
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    /**
                     * @example {
                     *       "name": "你好"
                     *     }
                     */
                    "application/json": {
                        name: string;
                        /** @description 允许为空，如果传入member代表创建vip订阅专用apikey */
                        type?: string | null;
                    };
                };
            };
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status: boolean;
                            data: {
                                /**
                                 * @description 新创建的 API Key 完整值（格式：`sk-` 开头）。**此为唯一一次返回完整 Key，请立即保存，后续无法再次获取**
                                 * @example sk-2019c55114cdb233bd2202c9273d4cc677ec76b04682a4b2ebbc11ab316636e2
                                 */
                                key: string;
                                /**
                                 * @description API Key 的名称标签
                                 * @example 我的生产环境 Key
                                 */
                                name: string;
                                /**
                                 * @description Key 的创建时间，ISO 8601 格式
                                 * @example 2026-01-01T00:00:00+08:00
                                 */
                                createdAt: string;
                                /**
                                 * @description Key 的当前启用状态，新创建的 Key 默认为 `true`（已启用）
                                 * @example true
                                 */
                                enabled: boolean;
                            };
                        };
                    };
                };
            };
        };
        /**
         * 删除 API Key
         * @description 永久删除指定的 API Key。
         *
         *     **前置条件：**
         *     - API Key 必须处于**禁用状态**才可删除。若 Key 当前为启用状态，请先调用 `PUT /inapi/v2/apikey/enabled` 将其禁用。
         *
         *     **注意事项：**
         *     - 删除操作**不可逆**，删除后该 Key 将无法恢复
         *     - 删除后，历史用量和账单数据仍会保留，不受影响
         */
        delete: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description 七牛 AK/SK 签名鉴权，格式：Bearer Qiniu &lt;AccessKey&gt;:&lt;EncodedSign&gt;
                     * @example Bearer Qiniu YOUR_ACCESS_KEY:BASE64_ENCODED_SIGN
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    /**
                     * @example {
                     *       "key": "sk-2019c55114cdb233bd2202c9273d4cc677ec76b04682a4b2ebbc11ab316636e2"
                     *     }
                     */
                    "application/json": {
                        /** @description 要删除的 API Key 完整值，必须为已禁用状态的 Key */
                        key: string;
                    };
                };
            };
            responses: {
                /** @description 删除成功 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description 操作是否成功，`true` 表示已成功删除
                             * @example true
                             */
                            status: boolean;
                            /** @description 无实际数据，操作结果以 `status` 字段为准 */
                            data: Record<string, never>;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/apikeys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 获取所有 API Key 列表（含配额及用量信息）
         * @description 获取当前账户下所有 API Key 的基本信息及配额用量详情。
         *
         *     **返回字段说明：**
         *     - `key`：API Key 值（已脱敏显示）
         *     - `name`：Key 的名称标签
         *     - `createdAt`：Key 的创建时间
         *     - `lastUsed`：Key 最近一次被使用的时间，从未使用则为空
         *     - `enabled`：Key 当前的启用状态
         *     - `totalTokens`：Key 自创建以来累计消耗的 token 总量
         *     - `quota`：Key 的用量配额信息，包含：
         *       - `daily`：日配额（今日已用 / 日上限）
         *       - `monthly`：月配额（本月已用 / 月上限）
         *       - `total`：总配额（累计已用 / 总上限）
         *
         *     若某项配额未启用（`enabled: false`），则 `used` 和 `limit` 字段不具参考意义。
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description 七牛 AK/SK 签名鉴权，格式：Bearer Qiniu &lt;AccessKey&gt;:&lt;EncodedSign&gt;
                     * @example Bearer Qiniu YOUR_ACCESS_KEY:BASE64_ENCODED_SIGN
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description 查询成功，返回所有 API Key 列表 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            /**
                             * @description 请求是否成功
                             * @example true
                             */
                            status: boolean;
                            /** @description API Key 列表 */
                            data: {
                                /**
                                 * @description API Key 值（已脱敏，仅保留前后部分字符）
                                 * @example sk-2019c5***36e2
                                 */
                                key: string;
                                /**
                                 * @description API Key 的名称标签
                                 * @example 我的生产环境 Key
                                 */
                                name: string;
                                /**
                                 * @description Key 的创建时间，ISO 8601 格式
                                 * @example 2026-01-01T00:00:00+08:00
                                 */
                                createdAt: string;
                                /**
                                 * @description Key 最近一次被使用的时间，ISO 8601 格式；若从未使用则为空字符串
                                 * @example 2026-04-01T12:30:00+08:00
                                 */
                                lastUsed: string;
                                /**
                                 * @description Key 当前的启用状态，`true` 为已启用，`false` 为已禁用
                                 * @example true
                                 */
                                enabled: boolean;
                                /**
                                 * @description Key 自创建以来累计消耗的 token 总量（所有模型合计）
                                 * @example 1024000
                                 */
                                totalTokens: number;
                                /** @description Key 的用量配额信息 */
                                quota: {
                                    /** @description 日配额信息 */
                                    daily: {
                                        /** @description 日配额是否已启用 */
                                        enabled: boolean;
                                        /** @description 今日已使用量 */
                                        used: number;
                                        /** @description 日使用上限，`-1` 表示未设限 */
                                        limit: number;
                                    };
                                    /** @description 月配额信息 */
                                    monthly: {
                                        /** @description 月配额是否已启用 */
                                        enabled: boolean;
                                        /** @description 本月已使用量 */
                                        used: number;
                                        /** @description 月使用上限，`-1` 表示未设限 */
                                        limit: number;
                                    };
                                    /** @description 累计总配额信息 */
                                    total: {
                                        /** @description 总配额是否已启用 */
                                        enables: boolean;
                                        /** @description 累计已使用总量 */
                                        used: number;
                                        /** @description 累计使用上限，`-1` 表示未设限 */
                                        limit: number;
                                    };
                                };
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v2/apikey/name": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 修改 API Key 名称
         * @description 修改指定 API Key 的名称标签。名称仅作为管理标识，不影响 Key 的鉴权功能。
         *
         *     **字段说明：**
         *     - `key`：要修改的 API Key 完整值
         *     - `name`：新名称，长度 1 到 20 个字符
         *
         *     **注意：** 此接口仅修改名称，不影响 Key 的启用状态、配额设置或任何调用记录。
         */
        put: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description 七牛 AK/SK 签名鉴权，格式：Bearer Qiniu &lt;AccessKey&gt;:&lt;EncodedSign&gt;
                     * @example Bearer Qiniu YOUR_ACCESS_KEY:BASE64_ENCODED_SIGN
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: {
                content: {
                    /**
                     * @example {
                     *       "name": "平敬彪",
                     *       "key": "sk-13821f6bef8c5aaa8d3254ad4f7e01ab62b4a13a95f3d3abcd04ee0718970b03"
                     *     }
                     */
                    "application/json": {
                        /** @description API Key 的新名称，长度 1 到 20 个字符 */
                        name: string;
                        /** @description 要修改名称的 API Key 完整值 */
                        key: string;
                    };
                };
            };
            responses: {
                /** @description 名称修改成功，无响应体内容 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/html": Record<string, never>;
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v2/apikey/quota/{api_key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * 新增或更新 API Key 限额
         * @description 新增或更新指定 API Key 的用量限额配置，支持设置日限额（daily_quota）、月限额（monthly_quota）和总限额（total_quota）。每种限额均可独立启用/禁用，并可配置告警阈值（alert_threshold，百分比）和是否抑制告警（suppress_alert）。
         */
        put: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description 七牛 AK/SK 签名鉴权，格式：Bearer Qiniu &lt;AccessKey&gt;:&lt;EncodedSign&gt;
                     * @example Bearer Qiniu YOUR_ACCESS_KEY:BASE64_ENCODED_SIGN
                     */
                    Authorization?: string;
                };
                path: {
                    /** @description 要设置限额的 API Key 完整值（格式：`sk-` 开头的字符串） */
                    api_key: string;
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    /**
                     * @example {
                     *       "daily_quota": {
                     *         "enabled": true,
                     *         "limit": 1,
                     *         "alert_threshold": 10,
                     *         "suppress_alert": true
                     *       },
                     *       "monthly_quota": {
                     *         "enabled": true,
                     *         "limit": 5,
                     *         "alert_threshold": 50,
                     *         "suppress_alert": false
                     *       },
                     *       "total_quota": {
                     *         "enabled": true,
                     *         "limit": 10000,
                     *         "alert_threshold": 80,
                     *         "suppress_alert": true
                     *       }
                     *     }
                     */
                    "application/json": {
                        /** @description 日限额配置，按自然日（UTC+8）计算，每日零点重置 */
                        daily_quota?: {
                            /** @description 是否启用日限额 */
                            enabled?: boolean;
                            /** @description 日用量上限（token 数量，单位：个） */
                            limit?: number;
                            /** @description 告警触发阈值（百分比，0-100），达到该比例时发送告警通知 */
                            alert_threshold?: number;
                            /** @description 是否抑制告警通知，`true` 时即使触发阈值也不发送告警 */
                            suppress_alert?: boolean;
                        };
                        /** @description 月限额配置，按自然月（UTC+8）计算，每月 1 日零点重置 */
                        monthly_quota?: {
                            /** @description 是否启用月限额 */
                            enabled?: boolean;
                            /** @description 月用量上限（token 数量，单位：个） */
                            limit?: number;
                            /** @description 告警触发阈值（百分比，0-100），达到该比例时发送告警通知 */
                            alert_threshold?: number;
                            /** @description 是否抑制告警通知 */
                            suppress_alert?: boolean;
                        };
                        /** @description 累计总限额配置，从 Key 创建起累计计算，不重置 */
                        total_quota?: {
                            /** @description 是否启用总限额 */
                            enabled?: boolean;
                            /** @description 累计用量上限（token 数量，单位：个） */
                            limit?: number;
                            /** @description 告警触发阈值（百分比，0-100），达到该比例时发送告警通知 */
                            alert_threshold?: number;
                            /** @description 是否抑制告警通知 */
                            suppress_alert?: boolean;
                        };
                    };
                };
            };
            responses: {
                /** @description 限额配置更新成功，返回当前完整的限额配置 */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        /**
                         * @example {
                         *       "status": true,
                         *       "data": {
                         *         "daily_quota": {
                         *           "enabled": true,
                         *           "limit": 1,
                         *           "alert_threshold": 10,
                         *           "suppress_alert": true
                         *         },
                         *         "monthly_quota": {
                         *           "enabled": true,
                         *           "limit": 5,
                         *           "alert_threshold": 50,
                         *           "suppress_alert": false
                         *         },
                         *         "total_quota": {
                         *           "enabled": true,
                         *           "limit": 10000,
                         *           "alert_threshold": 80,
                         *           "suppress_alert": true
                         *         },
                         *         "created_at": "2026-03-17 09:32:28",
                         *         "updated_at": "2026-03-27 15:51:35"
                         *       }
                         *     }
                         */
                        "application/json": {
                            /**
                             * @description 操作是否成功
                             * @example true
                             */
                            status?: boolean;
                            /** @description 更新后的完整限额配置，包含 daily_quota、monthly_quota、total_quota 及时间戳 */
                            data?: {
                                /** @description 限额配置的创建时间 */
                                created_at?: string;
                                /** @description 限额配置的最后更新时间 */
                                updated_at?: string;
                            };
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/bill": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询单月账单
         * @description 查询指定月份的账单数据，可选择查询特定 API Key 或所有 Key 的汇总数据。
         *
         *     **适用场景：**
         *     - 月度账单查询
         *     - 单个 API Key 的费用统计
         *     - 按模型查看用量和费用分布
         *
         *
         *     #### 2026年4月1日更新 已上线
         *
         *     `BillItem`结构添加了key字段，用于存储计费项key，搭配`/inapi/v3/market/pricingitems`使用
         *
         *     #### 2026年4月3日更新
         *
         *     `total_fee`同级添加了 `total_requests` 用于显示总请求数
         */
        get: operations["getBillByKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/bill/all_keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询单月所有 API Key 的账单
         * @description 查询指定月份内所有有数据的 API Key 的账单信息。
         *
         *     **功能特性：**
         *     - 自动发现该月份有使用记录的所有 API Key
         *     - 分别返回每个 API Key 的账单明细
         *     - 最后返回所有 Key 的汇总数据（api_key="all"）
         *
         *
         *     #### 2026年4月1日更新 已上线
         *
         *     `BillItem`结构添加了key字段，用于存储计费项key，搭配`/inapi/v3/market/pricingitems`使用
         *
         *     #### 2026年4月3日更新
         *
         *     `total_fee`同级添加了 `total_requests` 用于显示总请求数
         */
        get: operations["getBillAllKeys"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/bill/range": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询时间范围内的账单（支持多粒度）
         * @description 查询指定时间范围内的账单数据，支持多种时间粒度聚合。
         *
         *     **功能特性：**
         *     - 支持月/天/小时/5分钟/分钟五种粒度
         *     - 返回按时间序列排列的数据
         *     - 可选择查询特定 API Key 或所有 Key
         *
         *     **时间范围限制：**
         *     - 月粒度：最长 35 天
         *     - 天粒度：最长 35 天
         *     - 小时粒度：最长 7 天
         *     - 5分钟粒度：最长 1 天
         *     - 分钟粒度：最长 1 天
         *
         *     ## 接口时间范围与数据粒度说明
         *
         *     接口根据传入的时间范围获取账单数据。时间最小分辨率为 **1 分钟**，查询范围为以传入时间为两端的**闭区间**，并会自动对结束时间进行分钟级扩展。
         *
         *     ---
         *
         *     ### 一、查询范围规则
         *
         *     - 若传入时间不满 1 分钟，结束时间会自动补齐至该分钟的最后一秒。
         *
         *     **示例：**
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:20:30Z`
         *       实际查询范围：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:20:59Z`
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:00Z`
         *       实际查询范围：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:59Z`
         *
         *     ---
         *
         *     ### 二、返回数据时间含义
         *
         *     返回结果中的时间字段 `time` 表示一个时间区间，区间定义为：
         *
         *     - **左闭右开区间**：`[time, time + 粒度)`
         *
         *     ---
         *
         *     ### 三、按 5 分钟粒度示例
         *
         *     #### 示例 1
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:24:59Z`
         *     - 返回：1 个时间颗粒
         *
         *     | 时间（T）              | 表示区间                              |
         *     |----------------------|---------------------------------------|
         *     | 2026-03-18T12:20:00Z | 2026-03-18T12:20:00Z ~ 2026-03-18T12:24:59Z |
         *
         *     ---
         *
         *     #### 示例 2
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:00Z`
         *     - 返回：2 个时间颗粒
         *
         *     | 时间（T）              | 表示区间                              |
         *     |----------------------|---------------------------------------|
         *     | 2026-03-18T12:20:00Z | 2026-03-18T12:20:00Z ~ 2026-03-18T12:24:59Z |
         *     | 2026-03-18T12:25:00Z | 2026-03-18T12:25:00Z ~ 2026-03-18T12:29:59Z |
         *
         *     ---
         *
         *     ### 四、重要说明
         *
         *     需要注意的是：**返回的时间颗粒区间并不一定是完整数据区间**，其数据范围受实际查询范围限制。
         *
         *     以示例 2 为例：
         *
         *     - 实际查询范围为：
         *       `2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:59Z`
         *
         *     - 数据划分如下：
         *       - `12:20:00Z ~ 12:24:59Z` → 完整落入第一个时间颗粒
         *       - `12:25:00Z ~ 12:25:59Z` → 仅覆盖第二个时间颗粒的部分区间
         *
         *     因此：
         *
         *     - 第二个时间颗粒（`12:25:00Z ~ 12:29:59Z`）**仅包含其与查询范围重叠部分的数据**，并非完整 5 分钟数据。
         *
         *     #### 2026年4月1日更新 已上线
         *
         *     `BillItem`结构添加了key字段，用于存储计费项key，搭配`/inapi/v3/market/pricingitems`使用
         *
         *     #### 2026年4月3日更新
         *
         *     `total_fee`同级添加了 `total_requests` 用于显示总请求数
         */
        get: operations["getBillByRange"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/bill/range/all_keys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询时间范围内所有 API Key 的账单（支持多粒度）
         * @description 查询指定时间范围内所有有数据的 API Key 的账单信息，支持多种时间粒度。
         *
         *     **功能特性：**
         *     - 自动发现有使用记录的所有 API Key
         *     - 分别返回每个 API Key 的时间序列账单
         *     - 最后返回所有 Key 的汇总数据（api_key="all"）
         *
         *     ## 接口时间范围与数据粒度说明
         *
         *     接口根据传入的时间范围获取账单数据。时间最小分辨率为 **1 分钟**，查询范围为以传入时间为两端的**闭区间**，并会自动对结束时间进行分钟级扩展。
         *
         *     ---
         *
         *     ### 一、查询范围规则
         *
         *     - 若传入时间不满 1 分钟，结束时间会自动补齐至该分钟的最后一秒。
         *
         *     **示例：**
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:20:30Z`
         *       实际查询范围：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:20:59Z`
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:00Z`
         *       实际查询范围：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:59Z`
         *
         *     ---
         *
         *     ### 二、返回数据时间含义
         *
         *     返回结果中的时间字段 `time` 表示一个时间区间，区间定义为：
         *
         *     - **左闭右开区间**：`[time, time + 粒度)`
         *
         *     ---
         *
         *     ### 三、按 5 分钟粒度示例
         *
         *     #### 示例 1
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:24:59Z`
         *     - 返回：1 个时间颗粒
         *
         *     | 时间（T）              | 表示区间                              |
         *     |----------------------|---------------------------------------|
         *     | 2026-03-18T12:20:00Z | 2026-03-18T12:20:00Z ~ 2026-03-18T12:24:59Z |
         *
         *     ---
         *
         *     #### 示例 2
         *
         *     - 传入：`2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:00Z`
         *     - 返回：2 个时间颗粒
         *
         *     | 时间（T）              | 表示区间                              |
         *     |----------------------|---------------------------------------|
         *     | 2026-03-18T12:20:00Z | 2026-03-18T12:20:00Z ~ 2026-03-18T12:24:59Z |
         *     | 2026-03-18T12:25:00Z | 2026-03-18T12:25:00Z ~ 2026-03-18T12:29:59Z |
         *
         *     ---
         *
         *     ### 四、重要说明
         *
         *     需要注意的是：**返回的时间颗粒区间并不一定是完整数据区间**，其数据范围受实际查询范围限制。
         *
         *     以示例 2 为例：
         *
         *     - 实际查询范围为：
         *       `2026-03-18T12:20:00Z` ~ `2026-03-18T12:25:59Z`
         *
         *     - 数据划分如下：
         *       - `12:20:00Z ~ 12:24:59Z` → 完整落入第一个时间颗粒
         *       - `12:25:00Z ~ 12:25:59Z` → 仅覆盖第二个时间颗粒的部分区间
         *
         *     因此：
         *
         *     - 第二个时间颗粒（`12:25:00Z ~ 12:29:59Z`）**仅包含其与查询范围重叠部分的数据**，并非完整 5 分钟数据。
         *
         *
         *     #### 2026年4月1日更新 已上线
         *
         *     `BillItem`结构添加了key字段，用于存储计费项key，搭配`/inapi/v3/market/pricingitems`使用
         *
         *     #### 2026年4月3日更新
         *
         *     `total_fee`同级添加了 `total_requests` 用于显示总请求数
         */
        get: operations["getBillAllKeysByRange"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 请求日志接口
         * @description 按时间范围、模型、状态码等条件分页查询请求日志。
         *     支持 chat / image / video 三种数据源，通过 `server_type` 参数指定，不填为尝试查询所有数据。
         *
         *     **时间范围限制**：start 到 end 不超过 35 天。
         *
         *     #### 260330更新
         *     - 方法返回的 `usage` 中，增加 `cached_input` 和 `cache_creation` 的字段
         *     - 新增 `bo_usage` 返回
         *     - 使用 [`/inapi/v3/market/pricingitems`](https://app.apifox.com/link/project/6174386/apis/api-436076957) 接口获取计费项名称
         */
        get: operations["getLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/log/detail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询单条日志详情
         * @description 根据 `request_id` 查询单条请求日志的完整详情，包含请求体、响应体、渠道调用链路等信息。
         *
         *     接口根据 `request_id` 前缀自动路由到对应数据源：
         *     - `chatcmpl-` → monitor_log（对话日志）
         *     - `chatimage-` → images_task（图片任务）
         *     - `qvideo-` → openai_video_job（视频任务）
         *
         *     仅能查询当前用户自身的数据，跨用户查询返回 404。
         */
        get: operations["getLogDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/stat/new": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 查询用量数据（新版）
         * @description 查询指定时间范围内的用量数据（新版格式）。支持按时间粒度（`g` 参数）聚合，可通过 `api_key` 参数过滤特定 API Key 的数据。返回按模型分组的时间序列用量，每个数据点包含名称、单位、总量及分时数值列表。
         */
        get: {
            parameters: {
                query?: {
                    /** @description 查询开始时间，RFC3339 格式（含时区），如 `2025-11-01T00:00:00+08:00` */
                    start?: string;
                    /** @description 查询结束时间，RFC3339 格式（含时区），如 `2025-11-30T23:59:59+08:00` */
                    end?: string;
                    /** @description 时间粒度。可选值：`month`（月）、`day`（天）、`hour`（小时）、`five_minute`（5分钟）、`minute`（分钟） */
                    g?: "month" | "day" | "hour" | "five_minute" | "minute";
                    /** @description 按 API Key 过滤（可选）。不传则返回账户下所有 Key 的汇总数据；传入则仅返回该 Key 的用量数据 */
                    api_key?: string;
                };
                header?: {
                    /**
                     * @description AK/SK 鉴权 token
                     * @example
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            status: boolean;
                            data: {
                                name: string;
                                items: {
                                    name: string;
                                    unit: string;
                                    total: number;
                                    values: {
                                        time: string;
                                        value: number;
                                    }[];
                                }[];
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/inapi/v3/market/pricingitems": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 获取计费项列表
         * @description 获取平台支持的所有计费项配置信息。返回数据与管理端接口一致，可配合账单接口中的 `key` 字段使用，通过计费项 key 映射到对应计费项名称。
         */
        get: {
            parameters: {
                query?: never;
                header?: {
                    /**
                     * @description AK/SK 鉴权 token
                     * @example
                     */
                    Authorization?: string;
                };
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": Record<string, never>;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/market/models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 获取模型市场列表
         * @description 该接口使用服务域名直接访问，不需要通过接口：
         *     - 国内：https://api.qnaigc.com
         *     - 全球：https://openai.sufy.com
         *
         *     公网暴露的模型市场接口，返回模型市场中的模型配置详情。
         *     支持排序和海外模型过滤（仅限 sufy.com 域名）。
         */
        get: operations["getMarketModels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description 模型账单 */
        ModelBill: {
            /**
             * @description 模型 ID
             * @example gpt-4
             */
            model_id?: string;
            /** @description 该模型下的计费项列表 */
            items?: {
                /**
                 * @description 计费项中文描述
                 * @example 文本输入 tokens
                 */
                name?: string;
                /** @description 用量信息 */
                usage?: {
                    /**
                     * Format: float
                     * @description 用量数值
                     * @example 150.5
                     */
                    count?: number;
                    /**
                     * @description 用量单位
                     * @example k/tokens
                     * @enum {string}
                     */
                    unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                };
                /**
                 * Format: float
                 * @description 费用（人民币元）
                 * @example 4.52
                 */
                fee?: number;
                /** @description 计费项key */
                key?: string;
            }[];
            /**
             * Format: float
             * @description 该模型下所有计费项的总费用（人民币元）
             * @example 6.03
             */
            total_fee?: number;
            total_requests?: number;
        };
        /** @description 模型账单时间序列 */
        ModelBillTimeSeries: {
            /**
             * @description 模型 ID
             * @example gpt-4
             */
            model_id?: string;
            /** @description 时间序列数据 */
            time_series?: {
                /**
                 * Format: date-time
                 * @description 时间点，RFC3339 格式
                 * @example 2025-11-01T00:00:00+08:00
                 */
                time?: string;
                /** @description 该时间点的计费项列表 */
                items?: {
                    /**
                     * @description 计费项中文描述
                     * @example 文本输入 tokens
                     */
                    name?: string;
                    /** @description 用量信息 */
                    usage?: {
                        /**
                         * Format: float
                         * @description 用量数值
                         * @example 150.5
                         */
                        count?: number;
                        /**
                         * @description 用量单位
                         * @example k/tokens
                         * @enum {string}
                         */
                        unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                    };
                    /**
                     * Format: float
                     * @description 费用（人民币元）
                     * @example 4.52
                     */
                    fee?: number;
                    /** @description 计费项key */
                    key?: string;
                }[];
                /**
                 * Format: float
                 * @description 该时间点的总费用（人民币元）
                 * @example 3
                 */
                total_fee?: number;
                total_requests?: number;
            }[];
            /**
             * Format: float
             * @description 整个时间序列的总费用（人民币元）
             * @example 6.03
             */
            total_fee?: number;
            total_requests?: number;
        };
        OKResp_StatLogPageResp: {
            status?: boolean;
        } & {
            data?: {
                items?: {
                    /**
                     * @description 请求 ID，前缀决定类型（chatcmpl- / chatimage- / qvideo-）
                     * @example chatcmpl-abc123
                     */
                    id?: string;
                    /**
                     * @description 模型 ID
                     * @example gpt-4o
                     */
                    model_id?: string;
                    /**
                     * @description API Key（已脱敏，格式 xxx-ab***cdef）
                     * @example sk-ab***c123
                     */
                    api_key?: string;
                    /**
                     * Format: date-time
                     * @description 请求开始时间
                     * @example 2025-03-01T10:00:00.000+08:00
                     */
                    start_time?: string;
                    /**
                     * Format: date-time
                     * @description 请求结束时间
                     * @example 2025-03-01T10:00:02.345+08:00
                     */
                    end_time?: string;
                    /**
                     * @description 日志来源类型
                     * @example chat
                     * @enum {string}
                     */
                    server_type?: "chat" | "image" | "video";
                    /**
                     * @description HTTP 状态码
                     * @example 200
                     */
                    code?: number;
                    /**
                     * @description 错误信息列表，成功时为空数组
                     * @example []
                     */
                    errors?: string[];
                    /**
                     * @description 请求状态（success / fail）
                     * @example success
                     */
                    state?: string;
                    /**
                     * @description 用量信息（key 为计费项名称，value 为数量）
                     * @example {
                     *       "input": 512,
                     *       "output": 128
                     *     }
                     */
                    usage?: {
                        [key: string]: number;
                    };
                    /** @description key为计费key，value为用量 */
                    bo_usage: Record<string, never>;
                }[];
                /**
                 * Format: int64
                 * @description 满足条件的总条数
                 * @example 100
                 */
                total?: number;
                /**
                 * @description 当前页码
                 * @example 1
                 */
                page?: number;
                /**
                 * @description 每页条数
                 * @example 20
                 */
                page_size?: number;
                /**
                 * @description 总页数
                 * @example 5
                 */
                total_pages?: number;
            };
        };
        /** @description 单个 API Key 的账单数据 */
        ApiKeyBill: {
            /**
             * @description API Key
             * @example sk-xxxxx
             */
            api_key?: string;
            /** @description 按模型分组的账单数据 */
            models?: {
                /**
                 * @description 模型 ID
                 * @example gpt-4
                 */
                model_id?: string;
                /** @description 该模型下的计费项列表 */
                items?: {
                    /**
                     * @description 计费项中文描述
                     * @example 文本输入 tokens
                     */
                    name?: string;
                    /** @description 用量信息 */
                    usage?: {
                        /**
                         * Format: float
                         * @description 用量数值
                         * @example 150.5
                         */
                        count?: number;
                        /**
                         * @description 用量单位
                         * @example k/tokens
                         * @enum {string}
                         */
                        unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                    };
                    /**
                     * Format: float
                     * @description 费用（人民币元）
                     * @example 4.52
                     */
                    fee?: number;
                    /** @description 计费项key */
                    key?: string;
                }[];
                /**
                 * Format: float
                 * @description 该模型下所有计费项的总费用（人民币元）
                 * @example 6.03
                 */
                total_fee?: number;
                total_requests?: number;
            }[];
        };
        /** @description 单个 API Key 的时间序列账单数据 */
        ApiKeyBillTimeSeries: {
            /**
             * @description API Key
             * @example sk-xxxxx
             */
            api_key?: string;
            /** @description 按模型分组的时间序列账单数据 */
            models?: {
                /**
                 * @description 模型 ID
                 * @example gpt-4
                 */
                model_id?: string;
                /** @description 时间序列数据 */
                time_series?: {
                    /**
                     * Format: date-time
                     * @description 时间点，RFC3339 格式
                     * @example 2025-11-01T00:00:00+08:00
                     */
                    time?: string;
                    /** @description 该时间点的计费项列表 */
                    items?: {
                        /**
                         * @description 计费项中文描述
                         * @example 文本输入 tokens
                         */
                        name?: string;
                        /** @description 用量信息 */
                        usage?: {
                            /**
                             * Format: float
                             * @description 用量数值
                             * @example 150.5
                             */
                            count?: number;
                            /**
                             * @description 用量单位
                             * @example k/tokens
                             * @enum {string}
                             */
                            unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                        };
                        /**
                         * Format: float
                         * @description 费用（人民币元）
                         * @example 4.52
                         */
                        fee?: number;
                        /** @description 计费项key */
                        key?: string;
                    }[];
                    /**
                     * Format: float
                     * @description 该时间点的总费用（人民币元）
                     * @example 3
                     */
                    total_fee?: number;
                    total_requests?: number;
                }[];
                /**
                 * Format: float
                 * @description 整个时间序列的总费用（人民币元）
                 * @example 6.03
                 */
                total_fee?: number;
                total_requests?: number;
            }[];
        };
        Error: {
            /** @example false */
            status?: boolean;
            /** @example 参数错误 */
            error?: string;
        };
        OKResp_ChatLogDetail: {
            status?: boolean;
        } & {
            /** @description 对话日志详情（request_id 前缀 chatcmpl-） */
            data?: {
                /** @example chatcmpl-abc123def456 */
                id?: string;
                /**
                 * @example success
                 * @enum {string}
                 */
                state?: "success" | "fail";
                /** @example 200 */
                code?: number;
                /** @example chat */
                server_type?: string;
                /**
                 * Format: date-time
                 * @example 2025-03-01T10:00:00.000+08:00
                 */
                start_time?: string;
                /**
                 * Format: date-time
                 * @example 2025-03-01T10:00:02.345+08:00
                 */
                end_time?: string;
                /**
                 * @description 用户请求的原始模型名
                 * @example gpt-4o
                 */
                original_model?: string;
                /** @example [] */
                errors?: string[];
                /** @description 各阶段耗时（毫秒） */
                cost_time?: {
                    /**
                     * Format: int64
                     * @description 收到请求到请求上游的耗时（ms）
                     * @example 50
                     */
                    last_req_upstream?: number;
                    /**
                     * Format: int64
                     * @description 收到请求到首字返回的耗时（ms）
                     * @example 320
                     */
                    ttft?: number;
                    /**
                     * Format: int64
                     * @description 收到请求到断开连接的总耗时（ms）
                     * @example 2345
                     */
                    latency?: number;
                };
                /** @description 用户信息（不含 API Key） */
                user?: {
                    /** @example 12345 */
                    uid?: string;
                    /** @example Mozilla/5.0 */
                    user_agent?: string;
                    /** @example 1.2.3.4 */
                    client_ip?: string;
                    /** @example  */
                    referer?: string;
                    /** @example  */
                    group?: string;
                };
                /** @description （当前隐藏）原始请求体（relay_form 等，结构因模型类型而异） */
                chat_request?: Record<string, never>;
                /** @description （当前隐藏）响应摘要（relay_stream_response 等，结构因模型类型而异） */
                chat_response?: Record<string, never>;
            };
        };
        ErrorResp: {
            /** @description HTTP 状态码 */
            code?: number;
            /** @description 错误描述 */
            message?: string;
        };
        /** @description 账单计费项详情 */
        BillItem: {
            /**
             * @description 计费项中文描述
             * @example 文本输入 tokens
             */
            name?: string;
            /** @description 用量信息 */
            usage?: {
                /**
                 * Format: float
                 * @description 用量数值
                 * @example 150.5
                 */
                count?: number;
                /**
                 * @description 用量单位
                 * @example k/tokens
                 * @enum {string}
                 */
                unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
            };
            /**
             * Format: float
             * @description 费用（人民币元）
             * @example 4.52
             */
            fee?: number;
            /** @description 计费项key */
            key?: string;
        };
        /** @description 用量信息 */
        UsageInfo: {
            /**
             * Format: float
             * @description 用量数值
             * @example 150.5
             */
            count?: number;
            /**
             * @description 用量单位
             * @example k/tokens
             * @enum {string}
             */
            unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
        };
        /** @description 时间序列数据点 */
        TimeSeriesData: {
            /**
             * Format: date-time
             * @description 时间点，RFC3339 格式
             * @example 2025-11-01T00:00:00+08:00
             */
            time?: string;
            /** @description 该时间点的计费项列表 */
            items?: {
                /**
                 * @description 计费项中文描述
                 * @example 文本输入 tokens
                 */
                name?: string;
                /** @description 用量信息 */
                usage?: {
                    /**
                     * Format: float
                     * @description 用量数值
                     * @example 150.5
                     */
                    count?: number;
                    /**
                     * @description 用量单位
                     * @example k/tokens
                     * @enum {string}
                     */
                    unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                };
                /**
                 * Format: float
                 * @description 费用（人民币元）
                 * @example 4.52
                 */
                fee?: number;
                /** @description 计费项key */
                key?: string;
            }[];
            /**
             * Format: float
             * @description 该时间点的总费用（人民币元）
             * @example 3
             */
            total_fee?: number;
            total_requests?: number;
        };
        BaseResp: {
            status?: boolean;
        };
        StatLogPageResp: {
            items?: {
                /**
                 * @description 请求 ID，前缀决定类型（chatcmpl- / chatimage- / qvideo-）
                 * @example chatcmpl-abc123
                 */
                id?: string;
                /**
                 * @description 模型 ID
                 * @example gpt-4o
                 */
                model_id?: string;
                /**
                 * @description API Key（已脱敏，格式 xxx-ab***cdef）
                 * @example sk-ab***c123
                 */
                api_key?: string;
                /**
                 * Format: date-time
                 * @description 请求开始时间
                 * @example 2025-03-01T10:00:00.000+08:00
                 */
                start_time?: string;
                /**
                 * Format: date-time
                 * @description 请求结束时间
                 * @example 2025-03-01T10:00:02.345+08:00
                 */
                end_time?: string;
                /**
                 * @description 日志来源类型
                 * @example chat
                 * @enum {string}
                 */
                server_type?: "chat" | "image" | "video";
                /**
                 * @description HTTP 状态码
                 * @example 200
                 */
                code?: number;
                /**
                 * @description 错误信息列表，成功时为空数组
                 * @example []
                 */
                errors?: string[];
                /**
                 * @description 请求状态（success / fail）
                 * @example success
                 */
                state?: string;
                /**
                 * @description 用量信息（key 为计费项名称，value 为数量）
                 * @example {
                 *       "input": 512,
                 *       "output": 128
                 *     }
                 */
                usage?: {
                    [key: string]: number;
                };
                /** @description key为计费key，value为用量 */
                bo_usage: Record<string, never>;
            }[];
            /**
             * Format: int64
             * @description 满足条件的总条数
             * @example 100
             */
            total?: number;
            /**
             * @description 当前页码
             * @example 1
             */
            page?: number;
            /**
             * @description 每页条数
             * @example 20
             */
            page_size?: number;
            /**
             * @description 总页数
             * @example 5
             */
            total_pages?: number;
        };
        /** @description 单条日志摘要（列表场景） */
        StatLogResp: {
            /**
             * @description 请求 ID，前缀决定类型（chatcmpl- / chatimage- / qvideo-）
             * @example chatcmpl-abc123
             */
            id?: string;
            /**
             * @description 模型 ID
             * @example gpt-4o
             */
            model_id?: string;
            /**
             * @description API Key（已脱敏，格式 xxx-ab***cdef）
             * @example sk-ab***c123
             */
            api_key?: string;
            /**
             * Format: date-time
             * @description 请求开始时间
             * @example 2025-03-01T10:00:00.000+08:00
             */
            start_time?: string;
            /**
             * Format: date-time
             * @description 请求结束时间
             * @example 2025-03-01T10:00:02.345+08:00
             */
            end_time?: string;
            /**
             * @description 日志来源类型
             * @example chat
             * @enum {string}
             */
            server_type?: "chat" | "image" | "video";
            /**
             * @description HTTP 状态码
             * @example 200
             */
            code?: number;
            /**
             * @description 错误信息列表，成功时为空数组
             * @example []
             */
            errors?: string[];
            /**
             * @description 请求状态（success / fail）
             * @example success
             */
            state?: string;
            /**
             * @description 用量信息（key 为计费项名称，value 为数量）
             * @example {
             *       "input": 512,
             *       "output": 128
             *     }
             */
            usage?: {
                [key: string]: number;
            };
            /** @description key为计费key，value为用量 */
            bo_usage: Record<string, never>;
        };
        /** @description 对话日志详情（request_id 前缀 chatcmpl-） */
        ChatLogDetail: {
            /** @example chatcmpl-abc123def456 */
            id?: string;
            /**
             * @example success
             * @enum {string}
             */
            state?: "success" | "fail";
            /** @example 200 */
            code?: number;
            /** @example chat */
            server_type?: string;
            /**
             * Format: date-time
             * @example 2025-03-01T10:00:00.000+08:00
             */
            start_time?: string;
            /**
             * Format: date-time
             * @example 2025-03-01T10:00:02.345+08:00
             */
            end_time?: string;
            /**
             * @description 用户请求的原始模型名
             * @example gpt-4o
             */
            original_model?: string;
            /** @example [] */
            errors?: string[];
            /** @description 各阶段耗时（毫秒） */
            cost_time?: {
                /**
                 * Format: int64
                 * @description 收到请求到请求上游的耗时（ms）
                 * @example 50
                 */
                last_req_upstream?: number;
                /**
                 * Format: int64
                 * @description 收到请求到首字返回的耗时（ms）
                 * @example 320
                 */
                ttft?: number;
                /**
                 * Format: int64
                 * @description 收到请求到断开连接的总耗时（ms）
                 * @example 2345
                 */
                latency?: number;
            };
            /** @description 用户信息（不含 API Key） */
            user?: {
                /** @example 12345 */
                uid?: string;
                /** @example Mozilla/5.0 */
                user_agent?: string;
                /** @example 1.2.3.4 */
                client_ip?: string;
                /** @example  */
                referer?: string;
                /** @example  */
                group?: string;
            };
            /** @description （当前隐藏）原始请求体（relay_form 等，结构因模型类型而异） */
            chat_request?: Record<string, never>;
            /** @description （当前隐藏）响应摘要（relay_stream_response 等，结构因模型类型而异） */
            chat_response?: Record<string, never>;
        };
        /** @description 各阶段耗时（毫秒） */
        CostTime: {
            /**
             * Format: int64
             * @description 收到请求到请求上游的耗时（ms）
             * @example 50
             */
            last_req_upstream?: number;
            /**
             * Format: int64
             * @description 收到请求到首字返回的耗时（ms）
             * @example 320
             */
            ttft?: number;
            /**
             * Format: int64
             * @description 收到请求到断开连接的总耗时（ms）
             * @example 2345
             */
            latency?: number;
        };
        /** @description 用户信息（不含 API Key） */
        RequestLogUser: {
            /** @example 12345 */
            uid?: string;
            /** @example Mozilla/5.0 */
            user_agent?: string;
            /** @example 1.2.3.4 */
            client_ip?: string;
            /** @example  */
            referer?: string;
            /** @example  */
            group?: string;
        };
        SuccessResponse_ModelDTO: {
            /** @example true */
            status: boolean;
            data: {
                /**
                 * @description 模型唯一标识
                 * @example gpt-4o
                 */
                id: string;
                /**
                 * @description 模型名称
                 * @example GPT-4o
                 */
                name: string;
                /**
                 * @description 模型描述
                 * @example OpenAI 最新的多模态模型
                 */
                description: string;
                /**
                 * @description 模型创建时间
                 * @example 2024-05-13
                 */
                created_time: string;
                /**
                 * @description 模型图标 URL
                 * @example
                 */
                avatar: string;
                /**
                 * @description 热门标签
                 * @example [
                 *       "多模态",
                 *       "长上下文"
                 *     ]
                 */
                hot_tags: string[];
                /**
                 * @description 功能特性
                 * @example [
                 *       "文本生成",
                 *       "图片理解"
                 *     ]
                 */
                features: string[];
                /**
                 * @description 是否为私有模型
                 * @example false
                 */
                private: boolean;
                /** @description 模型约束参数 */
                model_constraints: {
                    /**
                     * @description 模型上下文长度
                     * @example 128000
                     */
                    context_length: number;
                    /**
                     * @description 模型最大输出 token 数
                     * @example 16384
                     */
                    max_completion_tokens: number;
                    /**
                     * @description 模型最大输出 token 数（与 max_completion_tokens 可能存在差异）
                     * @example 16384
                     */
                    max_tokens: number;
                    /**
                     * @description 模型默认最大输出 token 数
                     * @example 4096
                     */
                    max_default_completion_tokens: number;
                    /**
                     * @description 模型最大思考链长度
                     * @example 0
                     */
                    max_chain_of_thought_length: number;
                };
                /** @description 模型发行方 */
                issuer: {
                    /**
                     * @description 发行方名称
                     * @example OpenAI
                     */
                    name: string;
                    /**
                     * @description 发行方图标 URL
                     * @example
                     */
                    avatar: string;
                    /** @description 模型主页链接 */
                    model_page?: string | null;
                };
                /** @description 模型架构信息 */
                architecture: {
                    /**
                     * @description 输入模态列表
                     * @example [
                     *       "text",
                     *       "image"
                     *     ]
                     */
                    input_modalities: string[];
                    /**
                     * @description 输出模态列表
                     * @example [
                     *       "text"
                     *     ]
                     */
                    output_modalities: string[];
                    /** @description 模型能力标记 */
                    schema_output?: {
                        /**
                         * @description 是否支持该能力
                         * @example true
                         */
                        supported: boolean;
                        /** @description 能力描述（支持 Markdown 格式） */
                        description?: string;
                    };
                    /** @description 模型能力标记 */
                    function_calling?: {
                        /**
                         * @description 是否支持该能力
                         * @example true
                         */
                        supported: boolean;
                        /** @description 能力描述（支持 Markdown 格式） */
                        description?: string;
                    };
                    /** @description 模型能力标记 */
                    reasoning?: {
                        /**
                         * @description 是否支持该能力
                         * @example true
                         */
                        supported: boolean;
                        /** @description 能力描述（支持 Markdown 格式） */
                        description?: string;
                    };
                    /** @description 模型能力标记 */
                    content_cache?: {
                        /**
                         * @description 是否支持该能力
                         * @example true
                         */
                        supported: boolean;
                        /** @description 能力描述（支持 Markdown 格式） */
                        description?: string;
                    };
                };
                /**
                 * @deprecated
                 * @description 定价规则列表
                 */
                pricing_rules: {
                    /** @description 成本渠道名称（仅成本项使用） */
                    name?: string | null;
                    /**
                     * @description 输入区间左右边界，`-1` 表示无上限
                     * @example [
                     *       0,
                     *       -1
                     *     ]
                     */
                    input_range: number[];
                    /**
                     * @description 输出区间左右边界，`-1` 表示无上限
                     * @example [
                     *       0,
                     *       -1
                     *     ]
                     */
                    output_range: number[];
                    /**
                     * @description 输入计费项类型
                     * @example token
                     */
                    input_item_type: string;
                    /**
                     * @description 输出计费项类型
                     * @example token
                     */
                    output_item_type: string;
                    /**
                     * @deprecated
                     * @description 用量计费明细（V1 格式）。
                     *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
                     *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
                     *     等多种计费项，每个字段均为 PricingMode 类型。
                     */
                    details: {
                        /** @description 定价模式（区分实时推理和批量推理） */
                        total_prompt_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        total_completion_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        prompt_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        completion_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        reasoning_prompt_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        reasoning_completion_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        tts_bytes?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        asr_minutes?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        image_req_count?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        cached_hit?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        cache_storage?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                    };
                    /**
                     * @description 用量计费明细（V2 格式）。
                     *     包含 input、output、cache、th_input、th_output 等计费项，
                     *     每个字段均为 PricingItem 类型。
                     */
                    details_v2: {
                        /** @description 定价详情项 */
                        input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        cache?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        th_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        th_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        nth_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        nth_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        i_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        i_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        a_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        a_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        v_duration?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        av_duration?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        minute?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        hbyte?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        req?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                }[];
                /** @description 定价规则 V2 列表 */
                pricing_rules_v2?: {
                    /** @description 成本渠道名称（仅成本项使用） */
                    name?: string | null;
                    /**
                     * @description 输入区间左右边界，`-1` 表示无上限
                     * @example [
                     *       0,
                     *       -1
                     *     ]
                     */
                    input_range: number[];
                    /**
                     * @description 输出区间左右边界，`-1` 表示无上限
                     * @example [
                     *       0,
                     *       -1
                     *     ]
                     */
                    output_range: number[];
                    /**
                     * @description 输入计费项类型
                     * @example token
                     */
                    input_item_type: string;
                    /**
                     * @description 输出计费项类型
                     * @example token
                     */
                    output_item_type: string;
                    /**
                     * @deprecated
                     * @description 用量计费明细（V1 格式）。
                     *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
                     *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
                     *     等多种计费项，每个字段均为 PricingMode 类型。
                     */
                    details: {
                        /** @description 定价模式（区分实时推理和批量推理） */
                        total_prompt_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        total_completion_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        prompt_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        completion_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        reasoning_prompt_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        reasoning_completion_tokens?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        tts_bytes?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        asr_minutes?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        image_req_count?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        cached_hit?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                        /** @description 定价模式（区分实时推理和批量推理） */
                        cache_storage?: {
                            /** @description 定价详情项 */
                            real_time?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                            /** @description 定价详情项 */
                            batch?: {
                                /**
                                 * @description 定价单位名称
                                 * @example token
                                 */
                                unit_name: string;
                                /**
                                 * Format: int64
                                 * @description 定价单位量
                                 * @example 1000
                                 */
                                unit_size: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（人民币）
                                 * @example 0.05
                                 */
                                unit_price: number;
                                /**
                                 * Format: double
                                 * @description 每单位定价（美元）
                                 * @example 0.005
                                 */
                                unit_price_usd: number;
                                /**
                                 * @description 计费项中文名称
                                 * @example 输入
                                 */
                                name: string;
                            };
                        };
                    };
                    /**
                     * @description 用量计费明细（V2 格式）。
                     *     包含 input、output、cache、th_input、th_output 等计费项，
                     *     每个字段均为 PricingItem 类型。
                     */
                    details_v2: {
                        /** @description 定价详情项 */
                        input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        cache?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        th_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        th_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        nth_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        nth_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        i_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        i_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        a_input?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        a_output?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        v_duration?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        av_duration?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        minute?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        hbyte?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        req?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                }[];
                /**
                 * @deprecated
                 * @description 限流配置，key 为限流类型（rpm/tpm/ipm/qpm）
                 * @example {
                 *       "rpm": {
                 *         "name": "RPM",
                 *         "quantity": 10000,
                 *         "unit_name": "requests",
                 *         "unit_time": 60
                 *       }
                 *     }
                 */
                rate_limit: {
                    [key: string]: {
                        /**
                         * @description 限流项名称
                         * @example RPM
                         */
                        name: string;
                        /**
                         * Format: int64
                         * @description 限流数量
                         * @example 10000
                         */
                        quantity: number;
                        /**
                         * @description 限流单位名称
                         * @example requests
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 限流单位时间（秒）
                         * @example 60
                         */
                        unit_time: number;
                    };
                };
                /** @description 模型备案信息 */
                model_filing: {
                    /**
                     * @description 模型备案号
                     * @example
                     */
                    filing_no: string;
                };
                /**
                 * @deprecated
                 * @description 支持的请求参数列表
                 * @example [
                 *       "temperature",
                 *       "top_p",
                 *       "max_tokens",
                 *       "stream"
                 *     ]
                 */
                supported_parameters: string[];
                /**
                 * @description 支持的 API 协议列表
                 * @example [
                 *       "openai",
                 *       "anthropic"
                 *     ]
                 */
                support_api_protocols: string[];
                /**
                 * @description 模型排序权重
                 * @example 100
                 */
                rank: number;
                /**
                 * @description 模型退役时间（日期格式：2006-01-02），空字符串表示未设定
                 * @example
                 */
                retirement_at: string;
                /**
                 * @description 模型发布时间（日期格式：2006-01-02）
                 * @example 2024-05-13
                 */
                release_at: string;
                /**
                 * @description 模型退役后建议使用的新模型 ID
                 * @example
                 */
                suggested_model: string;
            }[];
        };
        ErrorResponse: {
            /** @example false */
            status: boolean;
            /** @example 错误信息 */
            error: string;
        };
        ModelDTO: {
            /**
             * @description 模型唯一标识
             * @example gpt-4o
             */
            id: string;
            /**
             * @description 模型名称
             * @example GPT-4o
             */
            name: string;
            /**
             * @description 模型描述
             * @example OpenAI 最新的多模态模型
             */
            description: string;
            /**
             * @description 模型创建时间
             * @example 2024-05-13
             */
            created_time: string;
            /**
             * @description 模型图标 URL
             * @example
             */
            avatar: string;
            /**
             * @description 热门标签
             * @example [
             *       "多模态",
             *       "长上下文"
             *     ]
             */
            hot_tags: string[];
            /**
             * @description 功能特性
             * @example [
             *       "文本生成",
             *       "图片理解"
             *     ]
             */
            features: string[];
            /**
             * @description 是否为私有模型
             * @example false
             */
            private: boolean;
            /** @description 模型约束参数 */
            model_constraints: {
                /**
                 * @description 模型上下文长度
                 * @example 128000
                 */
                context_length: number;
                /**
                 * @description 模型最大输出 token 数
                 * @example 16384
                 */
                max_completion_tokens: number;
                /**
                 * @description 模型最大输出 token 数（与 max_completion_tokens 可能存在差异）
                 * @example 16384
                 */
                max_tokens: number;
                /**
                 * @description 模型默认最大输出 token 数
                 * @example 4096
                 */
                max_default_completion_tokens: number;
                /**
                 * @description 模型最大思考链长度
                 * @example 0
                 */
                max_chain_of_thought_length: number;
            };
            /** @description 模型发行方 */
            issuer: {
                /**
                 * @description 发行方名称
                 * @example OpenAI
                 */
                name: string;
                /**
                 * @description 发行方图标 URL
                 * @example
                 */
                avatar: string;
                /** @description 模型主页链接 */
                model_page?: string | null;
            };
            /** @description 模型架构信息 */
            architecture: {
                /**
                 * @description 输入模态列表
                 * @example [
                 *       "text",
                 *       "image"
                 *     ]
                 */
                input_modalities: string[];
                /**
                 * @description 输出模态列表
                 * @example [
                 *       "text"
                 *     ]
                 */
                output_modalities: string[];
                /** @description 模型能力标记 */
                schema_output?: {
                    /**
                     * @description 是否支持该能力
                     * @example true
                     */
                    supported: boolean;
                    /** @description 能力描述（支持 Markdown 格式） */
                    description?: string;
                };
                /** @description 模型能力标记 */
                function_calling?: {
                    /**
                     * @description 是否支持该能力
                     * @example true
                     */
                    supported: boolean;
                    /** @description 能力描述（支持 Markdown 格式） */
                    description?: string;
                };
                /** @description 模型能力标记 */
                reasoning?: {
                    /**
                     * @description 是否支持该能力
                     * @example true
                     */
                    supported: boolean;
                    /** @description 能力描述（支持 Markdown 格式） */
                    description?: string;
                };
                /** @description 模型能力标记 */
                content_cache?: {
                    /**
                     * @description 是否支持该能力
                     * @example true
                     */
                    supported: boolean;
                    /** @description 能力描述（支持 Markdown 格式） */
                    description?: string;
                };
            };
            /**
             * @deprecated
             * @description 定价规则列表
             */
            pricing_rules: {
                /** @description 成本渠道名称（仅成本项使用） */
                name?: string | null;
                /**
                 * @description 输入区间左右边界，`-1` 表示无上限
                 * @example [
                 *       0,
                 *       -1
                 *     ]
                 */
                input_range: number[];
                /**
                 * @description 输出区间左右边界，`-1` 表示无上限
                 * @example [
                 *       0,
                 *       -1
                 *     ]
                 */
                output_range: number[];
                /**
                 * @description 输入计费项类型
                 * @example token
                 */
                input_item_type: string;
                /**
                 * @description 输出计费项类型
                 * @example token
                 */
                output_item_type: string;
                /**
                 * @deprecated
                 * @description 用量计费明细（V1 格式）。
                 *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
                 *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
                 *     等多种计费项，每个字段均为 PricingMode 类型。
                 */
                details: {
                    /** @description 定价模式（区分实时推理和批量推理） */
                    total_prompt_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    total_completion_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    prompt_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    completion_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    reasoning_prompt_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    reasoning_completion_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    tts_bytes?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    asr_minutes?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    image_req_count?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    cached_hit?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    cache_storage?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                };
                /**
                 * @description 用量计费明细（V2 格式）。
                 *     包含 input、output、cache、th_input、th_output 等计费项，
                 *     每个字段均为 PricingItem 类型。
                 */
                details_v2: {
                    /** @description 定价详情项 */
                    input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    cache?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    th_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    th_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    nth_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    nth_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    i_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    i_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    a_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    a_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    v_duration?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    av_duration?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    minute?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    hbyte?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    req?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
            }[];
            /** @description 定价规则 V2 列表 */
            pricing_rules_v2?: {
                /** @description 成本渠道名称（仅成本项使用） */
                name?: string | null;
                /**
                 * @description 输入区间左右边界，`-1` 表示无上限
                 * @example [
                 *       0,
                 *       -1
                 *     ]
                 */
                input_range: number[];
                /**
                 * @description 输出区间左右边界，`-1` 表示无上限
                 * @example [
                 *       0,
                 *       -1
                 *     ]
                 */
                output_range: number[];
                /**
                 * @description 输入计费项类型
                 * @example token
                 */
                input_item_type: string;
                /**
                 * @description 输出计费项类型
                 * @example token
                 */
                output_item_type: string;
                /**
                 * @deprecated
                 * @description 用量计费明细（V1 格式）。
                 *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
                 *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
                 *     等多种计费项，每个字段均为 PricingMode 类型。
                 */
                details: {
                    /** @description 定价模式（区分实时推理和批量推理） */
                    total_prompt_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    total_completion_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    prompt_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    completion_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    reasoning_prompt_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    reasoning_completion_tokens?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    tts_bytes?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    asr_minutes?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    image_req_count?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    cached_hit?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                    /** @description 定价模式（区分实时推理和批量推理） */
                    cache_storage?: {
                        /** @description 定价详情项 */
                        real_time?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                        /** @description 定价详情项 */
                        batch?: {
                            /**
                             * @description 定价单位名称
                             * @example token
                             */
                            unit_name: string;
                            /**
                             * Format: int64
                             * @description 定价单位量
                             * @example 1000
                             */
                            unit_size: number;
                            /**
                             * Format: double
                             * @description 每单位定价（人民币）
                             * @example 0.05
                             */
                            unit_price: number;
                            /**
                             * Format: double
                             * @description 每单位定价（美元）
                             * @example 0.005
                             */
                            unit_price_usd: number;
                            /**
                             * @description 计费项中文名称
                             * @example 输入
                             */
                            name: string;
                        };
                    };
                };
                /**
                 * @description 用量计费明细（V2 格式）。
                 *     包含 input、output、cache、th_input、th_output 等计费项，
                 *     每个字段均为 PricingItem 类型。
                 */
                details_v2: {
                    /** @description 定价详情项 */
                    input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    cache?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    th_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    th_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    nth_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    nth_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    i_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    i_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    a_input?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    a_output?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    v_duration?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    av_duration?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    minute?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    hbyte?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    req?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
            }[];
            /**
             * @deprecated
             * @description 限流配置，key 为限流类型（rpm/tpm/ipm/qpm）
             * @example {
             *       "rpm": {
             *         "name": "RPM",
             *         "quantity": 10000,
             *         "unit_name": "requests",
             *         "unit_time": 60
             *       }
             *     }
             */
            rate_limit: {
                [key: string]: {
                    /**
                     * @description 限流项名称
                     * @example RPM
                     */
                    name: string;
                    /**
                     * Format: int64
                     * @description 限流数量
                     * @example 10000
                     */
                    quantity: number;
                    /**
                     * @description 限流单位名称
                     * @example requests
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 限流单位时间（秒）
                     * @example 60
                     */
                    unit_time: number;
                };
            };
            /** @description 模型备案信息 */
            model_filing: {
                /**
                 * @description 模型备案号
                 * @example
                 */
                filing_no: string;
            };
            /**
             * @deprecated
             * @description 支持的请求参数列表
             * @example [
             *       "temperature",
             *       "top_p",
             *       "max_tokens",
             *       "stream"
             *     ]
             */
            supported_parameters: string[];
            /**
             * @description 支持的 API 协议列表
             * @example [
             *       "openai",
             *       "anthropic"
             *     ]
             */
            support_api_protocols: string[];
            /**
             * @description 模型排序权重
             * @example 100
             */
            rank: number;
            /**
             * @description 模型退役时间（日期格式：2006-01-02），空字符串表示未设定
             * @example
             */
            retirement_at: string;
            /**
             * @description 模型发布时间（日期格式：2006-01-02）
             * @example 2024-05-13
             */
            release_at: string;
            /**
             * @description 模型退役后建议使用的新模型 ID
             * @example
             */
            suggested_model: string;
        };
        /** @description 模型约束参数 */
        ModelConstraints: {
            /**
             * @description 模型上下文长度
             * @example 128000
             */
            context_length: number;
            /**
             * @description 模型最大输出 token 数
             * @example 16384
             */
            max_completion_tokens: number;
            /**
             * @description 模型最大输出 token 数（与 max_completion_tokens 可能存在差异）
             * @example 16384
             */
            max_tokens: number;
            /**
             * @description 模型默认最大输出 token 数
             * @example 4096
             */
            max_default_completion_tokens: number;
            /**
             * @description 模型最大思考链长度
             * @example 0
             */
            max_chain_of_thought_length: number;
        };
        /** @description 模型发行方 */
        Issuer: {
            /**
             * @description 发行方名称
             * @example OpenAI
             */
            name: string;
            /**
             * @description 发行方图标 URL
             * @example
             */
            avatar: string;
            /** @description 模型主页链接 */
            model_page?: string | null;
        };
        /** @description 模型架构信息 */
        ModelArchitecture: {
            /**
             * @description 输入模态列表
             * @example [
             *       "text",
             *       "image"
             *     ]
             */
            input_modalities: string[];
            /**
             * @description 输出模态列表
             * @example [
             *       "text"
             *     ]
             */
            output_modalities: string[];
            /** @description 模型能力标记 */
            schema_output?: {
                /**
                 * @description 是否支持该能力
                 * @example true
                 */
                supported: boolean;
                /** @description 能力描述（支持 Markdown 格式） */
                description?: string;
            };
            /** @description 模型能力标记 */
            function_calling?: {
                /**
                 * @description 是否支持该能力
                 * @example true
                 */
                supported: boolean;
                /** @description 能力描述（支持 Markdown 格式） */
                description?: string;
            };
            /** @description 模型能力标记 */
            reasoning?: {
                /**
                 * @description 是否支持该能力
                 * @example true
                 */
                supported: boolean;
                /** @description 能力描述（支持 Markdown 格式） */
                description?: string;
            };
            /** @description 模型能力标记 */
            content_cache?: {
                /**
                 * @description 是否支持该能力
                 * @example true
                 */
                supported: boolean;
                /** @description 能力描述（支持 Markdown 格式） */
                description?: string;
            };
        };
        /** @description 模型能力标记 */
        ModelAbility: {
            /**
             * @description 是否支持该能力
             * @example true
             */
            supported: boolean;
            /** @description 能力描述（支持 Markdown 格式） */
            description?: string;
        };
        /** @description 定价规则 */
        PricingRule: {
            /** @description 成本渠道名称（仅成本项使用） */
            name?: string | null;
            /**
             * @description 输入区间左右边界，`-1` 表示无上限
             * @example [
             *       0,
             *       -1
             *     ]
             */
            input_range: number[];
            /**
             * @description 输出区间左右边界，`-1` 表示无上限
             * @example [
             *       0,
             *       -1
             *     ]
             */
            output_range: number[];
            /**
             * @description 输入计费项类型
             * @example token
             */
            input_item_type: string;
            /**
             * @description 输出计费项类型
             * @example token
             */
            output_item_type: string;
            /**
             * @deprecated
             * @description 用量计费明细（V1 格式）。
             *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
             *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
             *     等多种计费项，每个字段均为 PricingMode 类型。
             */
            details: {
                /** @description 定价模式（区分实时推理和批量推理） */
                total_prompt_tokens?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                total_completion_tokens?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                prompt_tokens?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                completion_tokens?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                reasoning_prompt_tokens?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                reasoning_completion_tokens?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                tts_bytes?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                asr_minutes?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                image_req_count?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                cached_hit?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
                /** @description 定价模式（区分实时推理和批量推理） */
                cache_storage?: {
                    /** @description 定价详情项 */
                    real_time?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                    /** @description 定价详情项 */
                    batch?: {
                        /**
                         * @description 定价单位名称
                         * @example token
                         */
                        unit_name: string;
                        /**
                         * Format: int64
                         * @description 定价单位量
                         * @example 1000
                         */
                        unit_size: number;
                        /**
                         * Format: double
                         * @description 每单位定价（人民币）
                         * @example 0.05
                         */
                        unit_price: number;
                        /**
                         * Format: double
                         * @description 每单位定价（美元）
                         * @example 0.005
                         */
                        unit_price_usd: number;
                        /**
                         * @description 计费项中文名称
                         * @example 输入
                         */
                        name: string;
                    };
                };
            };
            /**
             * @description 用量计费明细（V2 格式）。
             *     包含 input、output、cache、th_input、th_output 等计费项，
             *     每个字段均为 PricingItem 类型。
             */
            details_v2: {
                /** @description 定价详情项 */
                input?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                output?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                cache?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                th_input?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                th_output?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                nth_input?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                nth_output?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                i_input?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                i_output?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                a_input?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                a_output?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                v_duration?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                av_duration?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                minute?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                hbyte?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                req?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
        };
        /**
         * @description 用量计费明细（V1 格式）。
         *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
         *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
         *     等多种计费项，每个字段均为 PricingMode 类型。
         */
        UsageItem: {
            /** @description 定价模式（区分实时推理和批量推理） */
            total_prompt_tokens?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            total_completion_tokens?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            prompt_tokens?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            completion_tokens?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            reasoning_prompt_tokens?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            reasoning_completion_tokens?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            tts_bytes?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            asr_minutes?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            image_req_count?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            cached_hit?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
            /** @description 定价模式（区分实时推理和批量推理） */
            cache_storage?: {
                /** @description 定价详情项 */
                real_time?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
                /** @description 定价详情项 */
                batch?: {
                    /**
                     * @description 定价单位名称
                     * @example token
                     */
                    unit_name: string;
                    /**
                     * Format: int64
                     * @description 定价单位量
                     * @example 1000
                     */
                    unit_size: number;
                    /**
                     * Format: double
                     * @description 每单位定价（人民币）
                     * @example 0.05
                     */
                    unit_price: number;
                    /**
                     * Format: double
                     * @description 每单位定价（美元）
                     * @example 0.005
                     */
                    unit_price_usd: number;
                    /**
                     * @description 计费项中文名称
                     * @example 输入
                     */
                    name: string;
                };
            };
        };
        /** @description 定价模式（区分实时推理和批量推理） */
        PricingMode: {
            /** @description 定价详情项 */
            real_time?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            batch?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
        };
        /** @description 定价详情项 */
        PricingItem: {
            /**
             * @description 定价单位名称
             * @example token
             */
            unit_name: string;
            /**
             * Format: int64
             * @description 定价单位量
             * @example 1000
             */
            unit_size: number;
            /**
             * Format: double
             * @description 每单位定价（人民币）
             * @example 0.05
             */
            unit_price: number;
            /**
             * Format: double
             * @description 每单位定价（美元）
             * @example 0.005
             */
            unit_price_usd: number;
            /**
             * @description 计费项中文名称
             * @example 输入
             */
            name: string;
        };
        /**
         * @description 用量计费明细（V2 格式）。
         *     包含 input、output、cache、th_input、th_output 等计费项，
         *     每个字段均为 PricingItem 类型。
         */
        UsageItemV2: {
            /** @description 定价详情项 */
            input?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            output?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            cache?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            th_input?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            th_output?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            nth_input?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            nth_output?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            i_input?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            i_output?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            a_input?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            a_output?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            v_duration?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            av_duration?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            minute?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            hbyte?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
            /** @description 定价详情项 */
            req?: {
                /**
                 * @description 定价单位名称
                 * @example token
                 */
                unit_name: string;
                /**
                 * Format: int64
                 * @description 定价单位量
                 * @example 1000
                 */
                unit_size: number;
                /**
                 * Format: double
                 * @description 每单位定价（人民币）
                 * @example 0.05
                 */
                unit_price: number;
                /**
                 * Format: double
                 * @description 每单位定价（美元）
                 * @example 0.005
                 */
                unit_price_usd: number;
                /**
                 * @description 计费项中文名称
                 * @example 输入
                 */
                name: string;
            };
        };
        /** @description 限流项明细 */
        RateLimitItem: {
            /**
             * @description 限流项名称
             * @example RPM
             */
            name: string;
            /**
             * Format: int64
             * @description 限流数量
             * @example 10000
             */
            quantity: number;
            /**
             * @description 限流单位名称
             * @example requests
             */
            unit_name: string;
            /**
             * Format: int64
             * @description 限流单位时间（秒）
             * @example 60
             */
            unit_time: number;
        };
        /** @description 模型备案信息 */
        ModelFiling: {
            /**
             * @description 模型备案号
             * @example
             */
            filing_no: string;
        };
    };
    responses: {
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @description HTTP 状态码 */
                    code?: number;
                    /** @description 错误描述 */
                    message?: string;
                };
            };
        };
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @description HTTP 状态码 */
                    code?: number;
                    /** @description 错误描述 */
                    message?: string;
                };
            };
        };
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @description HTTP 状态码 */
                    code?: number;
                    /** @description 错误描述 */
                    message?: string;
                };
            };
        };
        ServerError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @description HTTP 状态码 */
                    code?: number;
                    /** @description 错误描述 */
                    message?: string;
                };
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getBillByKey: {
        parameters: {
            query: {
                /** @description 查询月份，格式：YYYY-MM（例如：2025-11） */
                month: string;
                /**
                 * @description API Key（可选）。
                 *     - 不传：返回所有 API Key 的汇总数据
                 *     - 传入：返回指定 API Key 的账单数据
                 */
                api_key?: string;
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 成功返回账单数据 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "models": [
                     *         {
                     *           "model_id": "gpt-4",
                     *           "items": [
                     *             {
                     *               "name": "文本输入 tokens",
                     *               "usage": {
                     *                 "count": 150.5,
                     *                 "unit": "k/tokens"
                     *               },
                     *               "fee": 4.52
                     *             },
                     *             {
                     *               "name": "文本输出 tokens",
                     *               "usage": {
                     *                 "count": 50.2,
                     *                 "unit": "k/tokens"
                     *               },
                     *               "fee": 1.51
                     *             }
                     *           ],
                     *           "total_fee": 6.03
                     *         },
                     *         {
                     *           "model_id": "gpt-3.5-turbo",
                     *           "items": [
                     *             {
                     *               "name": "文本输入 tokens",
                     *               "usage": {
                     *                 "count": 1000,
                     *                 "unit": "k/tokens"
                     *               },
                     *               "fee": 1
                     *             }
                     *           ],
                     *           "total_fee": 1
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        /** @description 按模型分组的账单数据 */
                        models?: {
                            /**
                             * @description 模型 ID
                             * @example gpt-4
                             */
                            model_id?: string;
                            /** @description 该模型下的计费项列表 */
                            items?: {
                                /**
                                 * @description 计费项中文描述
                                 * @example 文本输入 tokens
                                 */
                                name?: string;
                                /** @description 用量信息 */
                                usage?: {
                                    /**
                                     * Format: float
                                     * @description 用量数值
                                     * @example 150.5
                                     */
                                    count?: number;
                                    /**
                                     * @description 用量单位
                                     * @example k/tokens
                                     * @enum {string}
                                     */
                                    unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                                };
                                /**
                                 * Format: float
                                 * @description 费用（人民币元）
                                 * @example 4.52
                                 */
                                fee?: number;
                                /** @description 计费项key */
                                key?: string;
                            }[];
                            /**
                             * Format: float
                             * @description 该模型下所有计费项的总费用（人民币元）
                             * @example 6.03
                             */
                            total_fee?: number;
                            total_requests?: number;
                        }[];
                    };
                };
            };
            /** @description 请求参数错误 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": "invalid month format, expected format: 2025-11"
                     *     }
                     */
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 鉴权失败 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 服务器内部错误 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
        };
    };
    getBillAllKeys: {
        parameters: {
            query: {
                /** @description 查询月份，格式：YYYY-MM（例如：2025-11） */
                month: string;
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 成功返回所有 API Key 的账单数据 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "api_keys": [
                     *         {
                     *           "api_key": "sk-key1",
                     *           "models": [
                     *             {
                     *               "model_id": "gpt-4",
                     *               "items": [
                     *                 {
                     *                   "name": "文本输入 tokens",
                     *                   "usage": {
                     *                     "count": 100,
                     *                     "unit": "k/tokens"
                     *                   },
                     *                   "fee": 3
                     *                 }
                     *               ],
                     *               "total_fee": 3
                     *             }
                     *           ]
                     *         },
                     *         {
                     *           "api_key": "sk-key2",
                     *           "models": [
                     *             {
                     *               "model_id": "gpt-3.5-turbo",
                     *               "items": [
                     *                 {
                     *                   "name": "文本输入 tokens",
                     *                   "usage": {
                     *                     "count": 500,
                     *                     "unit": "k/tokens"
                     *                   },
                     *                   "fee": 0.5
                     *                 }
                     *               ],
                     *               "total_fee": 0.5
                     *             }
                     *           ]
                     *         },
                     *         {
                     *           "api_key": "all",
                     *           "models": [
                     *             {
                     *               "model_id": "gpt-4",
                     *               "items": [
                     *                 {
                     *                   "name": "文本输入 tokens",
                     *                   "usage": {
                     *                     "count": 150,
                     *                     "unit": "k/tokens"
                     *                   },
                     *                   "fee": 4.5
                     *                 }
                     *               ],
                     *               "total_fee": 4.5
                     *             }
                     *           ]
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        /** @description 按 API Key 分组的账单数据 */
                        api_keys?: {
                            /**
                             * @description API Key
                             * @example sk-xxxxx
                             */
                            api_key?: string;
                            /** @description 按模型分组的账单数据 */
                            models?: {
                                /**
                                 * @description 模型 ID
                                 * @example gpt-4
                                 */
                                model_id?: string;
                                /** @description 该模型下的计费项列表 */
                                items?: {
                                    /**
                                     * @description 计费项中文描述
                                     * @example 文本输入 tokens
                                     */
                                    name?: string;
                                    /** @description 用量信息 */
                                    usage?: {
                                        /**
                                         * Format: float
                                         * @description 用量数值
                                         * @example 150.5
                                         */
                                        count?: number;
                                        /**
                                         * @description 用量单位
                                         * @example k/tokens
                                         * @enum {string}
                                         */
                                        unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                                    };
                                    /**
                                     * Format: float
                                     * @description 费用（人民币元）
                                     * @example 4.52
                                     */
                                    fee?: number;
                                    /** @description 计费项key */
                                    key?: string;
                                }[];
                                /**
                                 * Format: float
                                 * @description 该模型下所有计费项的总费用（人民币元）
                                 * @example 6.03
                                 */
                                total_fee?: number;
                                total_requests?: number;
                            }[];
                        }[];
                    };
                };
            };
            /** @description 请求参数错误 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 鉴权失败 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 服务器内部错误 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
        };
    };
    getBillByRange: {
        parameters: {
            query: {
                /** @description 开始时间，RFC3339 格式 */
                start: string;
                /** @description 结束时间，RFC3339 格式 */
                end: string;
                /**
                 * @description 时间粒度
                 *     - `month`: 月粒度
                 *     - `day`: 天粒度
                 *     - `hour`: 小时粒度
                 *     - `five_minute`: 5分钟粒度
                 *     - `minute`: 分钟粒度
                 */
                grain: "month" | "day" | "hour" | "five_minute" | "minute";
                /**
                 * @description API Key（可选）。
                 *     - 不传：返回所有 API Key 的汇总数据
                 *     - 传入：返回指定 API Key 的账单数据
                 */
                api_key?: string;
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 成功返回时间序列账单数据 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "models": [
                     *         {
                     *           "model_id": "gpt-4",
                     *           "time_series": [
                     *             {
                     *               "time": "2025-11-01T00:00:00+08:00",
                     *               "items": [
                     *                 {
                     *                   "name": "文本输入 tokens",
                     *                   "usage": {
                     *                     "count": 50.5,
                     *                     "unit": "k/tokens"
                     *                   },
                     *                   "fee": 1.52
                     *                 }
                     *               ],
                     *               "total_fee": 1.52
                     *             },
                     *             {
                     *               "time": "2025-11-02T00:00:00+08:00",
                     *               "items": [
                     *                 {
                     *                   "name": "文本输入 tokens",
                     *                   "usage": {
                     *                     "count": 100,
                     *                     "unit": "k/tokens"
                     *                   },
                     *                   "fee": 3
                     *                 }
                     *               ],
                     *               "total_fee": 3
                     *             }
                     *           ],
                     *           "total_fee": 4.52
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        /** @description 按模型分组的时间序列账单数据 */
                        models?: {
                            /**
                             * @description 模型 ID
                             * @example gpt-4
                             */
                            model_id?: string;
                            /** @description 时间序列数据 */
                            time_series?: {
                                /**
                                 * Format: date-time
                                 * @description 时间点，RFC3339 格式
                                 * @example 2025-11-01T00:00:00+08:00
                                 */
                                time?: string;
                                /** @description 该时间点的计费项列表 */
                                items?: {
                                    /**
                                     * @description 计费项中文描述
                                     * @example 文本输入 tokens
                                     */
                                    name?: string;
                                    /** @description 用量信息 */
                                    usage?: {
                                        /**
                                         * Format: float
                                         * @description 用量数值
                                         * @example 150.5
                                         */
                                        count?: number;
                                        /**
                                         * @description 用量单位
                                         * @example k/tokens
                                         * @enum {string}
                                         */
                                        unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                                    };
                                    /**
                                     * Format: float
                                     * @description 费用（人民币元）
                                     * @example 4.52
                                     */
                                    fee?: number;
                                    /** @description 计费项key */
                                    key?: string;
                                }[];
                                /**
                                 * Format: float
                                 * @description 该时间点的总费用（人民币元）
                                 * @example 3
                                 */
                                total_fee?: number;
                                total_requests?: number;
                            }[];
                            /**
                             * Format: float
                             * @description 整个时间序列的总费用（人民币元）
                             * @example 6.03
                             */
                            total_fee?: number;
                            total_requests?: number;
                        }[];
                    };
                };
            };
            /** @description 请求参数错误 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "success": false,
                     *       "error": "time range cannot exceed 1 day for minute granularity"
                     *     }
                     */
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 鉴权失败 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 服务器内部错误 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
        };
    };
    getBillAllKeysByRange: {
        parameters: {
            query: {
                /** @description 开始时间，RFC3339 格式 */
                start: string;
                /** @description 结束时间，RFC3339 格式 */
                end: string;
                /**
                 * @description 时间粒度
                 *     - `month`: 月粒度
                 *     - `day`: 天粒度
                 *     - `hour`: 小时粒度
                 *     - `five_minute`: 5分钟粒度
                 *     - `minute`: 分钟粒度
                 */
                grain: "month" | "day" | "hour" | "five_minute" | "minute";
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 成功返回所有 API Key 的时间序列账单数据 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "api_keys": [
                     *         {
                     *           "api_key": "sk-key1",
                     *           "models": [
                     *             {
                     *               "model_id": "gpt-4",
                     *               "time_series": [
                     *                 {
                     *                   "time": "2025-11-01T00:00:00+08:00",
                     *                   "items": [
                     *                     {
                     *                       "name": "文本输入 tokens",
                     *                       "usage": {
                     *                         "count": 50,
                     *                         "unit": "k/tokens"
                     *                       },
                     *                       "fee": 1.5
                     *                     }
                     *                   ],
                     *                   "total_fee": 1.5
                     *                 }
                     *               ],
                     *               "total_fee": 1.5
                     *             }
                     *           ]
                     *         },
                     *         {
                     *           "api_key": "all",
                     *           "models": [
                     *             {
                     *               "model_id": "gpt-4",
                     *               "time_series": [
                     *                 {
                     *                   "time": "2025-11-01T00:00:00+08:00",
                     *                   "items": [
                     *                     {
                     *                       "name": "文本输入 tokens",
                     *                       "usage": {
                     *                         "count": 150,
                     *                         "unit": "k/tokens"
                     *                       },
                     *                       "fee": 4.5
                     *                     }
                     *                   ],
                     *                   "total_fee": 4.5
                     *                 }
                     *               ],
                     *               "total_fee": 4.5
                     *             }
                     *           ]
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        /** @description 按 API Key 分组的时间序列账单数据 */
                        api_keys?: {
                            /**
                             * @description API Key
                             * @example sk-xxxxx
                             */
                            api_key?: string;
                            /** @description 按模型分组的时间序列账单数据 */
                            models?: {
                                /**
                                 * @description 模型 ID
                                 * @example gpt-4
                                 */
                                model_id?: string;
                                /** @description 时间序列数据 */
                                time_series?: {
                                    /**
                                     * Format: date-time
                                     * @description 时间点，RFC3339 格式
                                     * @example 2025-11-01T00:00:00+08:00
                                     */
                                    time?: string;
                                    /** @description 该时间点的计费项列表 */
                                    items?: {
                                        /**
                                         * @description 计费项中文描述
                                         * @example 文本输入 tokens
                                         */
                                        name?: string;
                                        /** @description 用量信息 */
                                        usage?: {
                                            /**
                                             * Format: float
                                             * @description 用量数值
                                             * @example 150.5
                                             */
                                            count?: number;
                                            /**
                                             * @description 用量单位
                                             * @example k/tokens
                                             * @enum {string}
                                             */
                                            unit?: "k/tokens" | "百字符" | "分钟" | "秒" | "次" | "张" | "default";
                                        };
                                        /**
                                         * Format: float
                                         * @description 费用（人民币元）
                                         * @example 4.52
                                         */
                                        fee?: number;
                                        /** @description 计费项key */
                                        key?: string;
                                    }[];
                                    /**
                                     * Format: float
                                     * @description 该时间点的总费用（人民币元）
                                     * @example 3
                                     */
                                    total_fee?: number;
                                    total_requests?: number;
                                }[];
                                /**
                                 * Format: float
                                 * @description 整个时间序列的总费用（人民币元）
                                 * @example 6.03
                                 */
                                total_fee?: number;
                                total_requests?: number;
                            }[];
                        }[];
                    };
                };
            };
            /** @description 请求参数错误 */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 鉴权失败 */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
            /** @description 服务器内部错误 */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status?: boolean;
                        /** @example 参数错误 */
                        error?: string;
                    };
                };
            };
        };
    };
    getLogs: {
        parameters: {
            query: {
                /** @description 开始时间，RFC3339 格式（含时区），如 `2025-03-01T00:00:00+08:00` */
                start?: string;
                /** @description 结束时间，RFC3339 格式（含时区），如 `2025-03-02T00:00:00+08:00` */
                end?: string;
                /** @description 页码，从 1 开始 */
                page: number;
                /** @description 每页条数，范围 1–100 */
                page_size: number;
                /** @description 模型名称过滤（精确匹配），不传则不限制 */
                model?: string;
                /**
                 * @description HTTP 状态码精确过滤，0 或不传表示不限制。
                 *     与 `status` 二选一，**`code` 优先级高于 `status`**。
                 */
                code?: number;
                /**
                 * @description 状态分类过滤，与 `code` 二选一，`code` 优先。
                 *
                 *     | 枚举值 | 含义 |
                 *     |---|---|
                 *     | success | 成功：code = 200 |
                 *     | failure | 失败：code ≠ 200 |
                 *     | client_error | 客户端错误：4xx |
                 *     | server_error | 服务端错误：5xx |
                 */
                status?: "success" | "failure" | "client_error" | "server_error";
                /** @description API Key 过滤（精确匹配，不含 "Bearer " 前缀），不传则不限制 */
                apikey?: string;
                /**
                 * @description 日志数据来源类型，不传默认为 `chat`。
                 *     `image` 和 `video` 类型暂不支持 `code`/`status` 过滤。
                 */
                server_type?: "chat" | "image" | "video";
                /** @description 制定日志id，多模态id对3月12日后数据有效 */
                id?: string;
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 查询成功 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "code": 0,
                     *       "data": {
                     *         "items": [
                     *           {
                     *             "id": "chatcmpl-abc123",
                     *             "model_id": "gpt-4o",
                     *             "api_key": "sk-ab***c123",
                     *             "start_time": "2025-03-01T10:00:00.000+08:00",
                     *             "end_time": "2025-03-01T10:00:02.345+08:00",
                     *             "server_type": "chat",
                     *             "code": 200,
                     *             "errors": [],
                     *             "state": "success",
                     *             "usage": {
                     *               "input": 512,
                     *               "output": 128
                     *             }
                     *           }
                     *         ],
                     *         "total": 1,
                     *         "page": 1,
                     *         "page_size": 20,
                     *         "total_pages": 1
                     *       },
                     *       "message": "ok"
                     *     }
                     */
                    "application/json": {
                        status?: boolean;
                    } & {
                        data?: {
                            items?: {
                                /**
                                 * @description 请求 ID，前缀决定类型（chatcmpl- / chatimage- / qvideo-）
                                 * @example chatcmpl-abc123
                                 */
                                id?: string;
                                /**
                                 * @description 模型 ID
                                 * @example gpt-4o
                                 */
                                model_id?: string;
                                /**
                                 * @description API Key（已脱敏，格式 xxx-ab***cdef）
                                 * @example sk-ab***c123
                                 */
                                api_key?: string;
                                /**
                                 * Format: date-time
                                 * @description 请求开始时间
                                 * @example 2025-03-01T10:00:00.000+08:00
                                 */
                                start_time?: string;
                                /**
                                 * Format: date-time
                                 * @description 请求结束时间
                                 * @example 2025-03-01T10:00:02.345+08:00
                                 */
                                end_time?: string;
                                /**
                                 * @description 日志来源类型
                                 * @example chat
                                 * @enum {string}
                                 */
                                server_type?: "chat" | "image" | "video";
                                /**
                                 * @description HTTP 状态码
                                 * @example 200
                                 */
                                code?: number;
                                /**
                                 * @description 错误信息列表，成功时为空数组
                                 * @example []
                                 */
                                errors?: string[];
                                /**
                                 * @description 请求状态（success / fail）
                                 * @example success
                                 */
                                state?: string;
                                /**
                                 * @description 用量信息（key 为计费项名称，value 为数量）
                                 * @example {
                                 *       "input": 512,
                                 *       "output": 128
                                 *     }
                                 */
                                usage?: {
                                    [key: string]: number;
                                };
                                /** @description key为计费key，value为用量 */
                                bo_usage: Record<string, never>;
                            }[];
                            /**
                             * Format: int64
                             * @description 满足条件的总条数
                             * @example 100
                             */
                            total?: number;
                            /**
                             * @description 当前页码
                             * @example 1
                             */
                            page?: number;
                            /**
                             * @description 每页条数
                             * @example 20
                             */
                            page_size?: number;
                            /**
                             * @description 总页数
                             * @example 5
                             */
                            total_pages?: number;
                        };
                    };
                };
            };
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
        };
    };
    getLogDetail: {
        parameters: {
            query: {
                /**
                 * @description 请求 ID，由前缀决定数据来源：
                 *     - `chatcmpl-*`：对话日志
                 *     - `chatimage-*`：图片任务
                 *     - `qvideo-*`：视频任务
                 */
                request_id: string;
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 查询成功 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "code": 0,
                     *       "data": {
                     *         "id": "chatcmpl-abc123def456",
                     *         "state": "success",
                     *         "code": 200,
                     *         "server_type": "chat",
                     *         "start_time": "2025-03-01T10:00:00.000+08:00",
                     *         "end_time": "2025-03-01T10:00:02.345+08:00",
                     *         "original_model": "gpt-4o",
                     *         "errors": [],
                     *         "cost_time": {
                     *           "last_req_upstream": 50,
                     *           "ttft": 320,
                     *           "latency": 2345
                     *         },
                     *         "user": {
                     *           "uid": "12345",
                     *           "user_agent": "Mozilla/5.0",
                     *           "client_ip": "1.2.3.4",
                     *           "referer": "",
                     *           "group": ""
                     *         }
                     *       },
                     *       "message": "ok"
                     *     }
                     */
                    "application/json": {
                        status?: boolean;
                    } & {
                        /** @description 对话日志详情（request_id 前缀 chatcmpl-） */
                        data?: {
                            /** @example chatcmpl-abc123def456 */
                            id?: string;
                            /**
                             * @example success
                             * @enum {string}
                             */
                            state?: "success" | "fail";
                            /** @example 200 */
                            code?: number;
                            /** @example chat */
                            server_type?: string;
                            /**
                             * Format: date-time
                             * @example 2025-03-01T10:00:00.000+08:00
                             */
                            start_time?: string;
                            /**
                             * Format: date-time
                             * @example 2025-03-01T10:00:02.345+08:00
                             */
                            end_time?: string;
                            /**
                             * @description 用户请求的原始模型名
                             * @example gpt-4o
                             */
                            original_model?: string;
                            /** @example [] */
                            errors?: string[];
                            /** @description 各阶段耗时（毫秒） */
                            cost_time?: {
                                /**
                                 * Format: int64
                                 * @description 收到请求到请求上游的耗时（ms）
                                 * @example 50
                                 */
                                last_req_upstream?: number;
                                /**
                                 * Format: int64
                                 * @description 收到请求到首字返回的耗时（ms）
                                 * @example 320
                                 */
                                ttft?: number;
                                /**
                                 * Format: int64
                                 * @description 收到请求到断开连接的总耗时（ms）
                                 * @example 2345
                                 */
                                latency?: number;
                            };
                            /** @description 用户信息（不含 API Key） */
                            user?: {
                                /** @example 12345 */
                                uid?: string;
                                /** @example Mozilla/5.0 */
                                user_agent?: string;
                                /** @example 1.2.3.4 */
                                client_ip?: string;
                                /** @example  */
                                referer?: string;
                                /** @example  */
                                group?: string;
                            };
                            /** @description （当前隐藏）原始请求体（relay_form 等，结构因模型类型而异） */
                            chat_request?: Record<string, never>;
                            /** @description （当前隐藏）响应摘要（relay_stream_response 等，结构因模型类型而异） */
                            chat_response?: Record<string, never>;
                        };
                    };
                };
            };
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description HTTP 状态码 */
                        code?: number;
                        /** @description 错误描述 */
                        message?: string;
                    };
                };
            };
        };
    };
    getMarketModels: {
        parameters: {
            query?: {
                /** @description 排序字段 */
                sort?: "rank" | "id";
                /** @description 排序方向 */
                order?: "asc" | "desc";
                /**
                 * @description 是否查询海外模型。仅当请求来自 sufy.com 域名时可用，
                 *     其他域名请求海外模型将返回错误。
                 */
                overseas?: "true" | "false";
            };
            header?: {
                /**
                 * @description AK/SK 鉴权 token
                 * @example
                 */
                Authorization?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description 成功返回模型市场列表 */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "status": true,
                     *       "data": [
                     *         {
                     *           "id": "gpt-4o",
                     *           "name": "GPT-4o",
                     *           "description": "OpenAI 最新的多模态模型",
                     *           "created_time": "2024-05-13",
                     *           "avatar": "",
                     *           "hot_tags": [
                     *             "多模态",
                     *             "长上下文"
                     *           ],
                     *           "features": [
                     *             "文本生成",
                     *             "图片理解"
                     *           ],
                     *           "private": false,
                     *           "model_constraints": {
                     *             "context_length": 128000,
                     *             "max_completion_tokens": 16384,
                     *             "max_tokens": 16384,
                     *             "max_default_completion_tokens": 4096,
                     *             "max_chain_of_thought_length": 0
                     *           },
                     *           "issuer": {
                     *             "name": "OpenAI",
                     *             "avatar": ""
                     *           },
                     *           "architecture": {
                     *             "input_modalities": [
                     *               "text",
                     *               "image"
                     *             ],
                     *             "output_modalities": [
                     *               "text"
                     *             ],
                     *             "schema_output": {
                     *               "supported": true,
                     *               "description": "支持 JSON Schema 结构化输出"
                     *             },
                     *             "function_calling": {
                     *               "supported": true
                     *             },
                     *             "reasoning": {
                     *               "supported": false
                     *             },
                     *             "content_cache": {
                     *               "supported": true
                     *             }
                     *           },
                     *           "pricing_rules": [
                     *             {
                     *               "input_range": [
                     *                 0,
                     *                 -1
                     *               ],
                     *               "output_range": [
                     *                 0,
                     *                 -1
                     *               ],
                     *               "input_item_type": "token",
                     *               "output_item_type": "token",
                     *               "details": {
                     *                 "prompt_tokens": {
                     *                   "real_time": {
                     *                     "unit_name": "token",
                     *                     "unit_size": 1000,
                     *                     "unit_price": 0.05,
                     *                     "unit_price_usd": 0.005,
                     *                     "name": "输入"
                     *                   }
                     *                 },
                     *                 "completion_tokens": {
                     *                   "real_time": {
                     *                     "unit_name": "token",
                     *                     "unit_size": 1000,
                     *                     "unit_price": 0.15,
                     *                     "unit_price_usd": 0.015,
                     *                     "name": "输出"
                     *                   }
                     *                 }
                     *               }
                     *             }
                     *           ],
                     *           "rate_limit": {
                     *             "rpm": {
                     *               "name": "RPM",
                     *               "quantity": 10000,
                     *               "unit_name": "requests",
                     *               "unit_time": 60
                     *             },
                     *             "tpm": {
                     *               "name": "TPM",
                     *               "quantity": 5000000,
                     *               "unit_name": "tokens",
                     *               "unit_time": 60
                     *             }
                     *           },
                     *           "rank": 100,
                     *           "retirement_at": "",
                     *           "release_at": "2024-05-13",
                     *           "suggested_model": ""
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        /** @example true */
                        status: boolean;
                        data: {
                            /**
                             * @description 模型唯一标识
                             * @example gpt-4o
                             */
                            id: string;
                            /**
                             * @description 模型名称
                             * @example GPT-4o
                             */
                            name: string;
                            /**
                             * @description 模型描述
                             * @example OpenAI 最新的多模态模型
                             */
                            description: string;
                            /**
                             * @description 模型创建时间
                             * @example 2024-05-13
                             */
                            created_time: string;
                            /**
                             * @description 模型图标 URL
                             * @example
                             */
                            avatar: string;
                            /**
                             * @description 热门标签
                             * @example [
                             *       "多模态",
                             *       "长上下文"
                             *     ]
                             */
                            hot_tags: string[];
                            /**
                             * @description 功能特性
                             * @example [
                             *       "文本生成",
                             *       "图片理解"
                             *     ]
                             */
                            features: string[];
                            /**
                             * @description 是否为私有模型
                             * @example false
                             */
                            private: boolean;
                            /** @description 模型约束参数 */
                            model_constraints: {
                                /**
                                 * @description 模型上下文长度
                                 * @example 128000
                                 */
                                context_length: number;
                                /**
                                 * @description 模型最大输出 token 数
                                 * @example 16384
                                 */
                                max_completion_tokens: number;
                                /**
                                 * @description 模型最大输出 token 数（与 max_completion_tokens 可能存在差异）
                                 * @example 16384
                                 */
                                max_tokens: number;
                                /**
                                 * @description 模型默认最大输出 token 数
                                 * @example 4096
                                 */
                                max_default_completion_tokens: number;
                                /**
                                 * @description 模型最大思考链长度
                                 * @example 0
                                 */
                                max_chain_of_thought_length: number;
                            };
                            /** @description 模型发行方 */
                            issuer: {
                                /**
                                 * @description 发行方名称
                                 * @example OpenAI
                                 */
                                name: string;
                                /**
                                 * @description 发行方图标 URL
                                 * @example
                                 */
                                avatar: string;
                                /** @description 模型主页链接 */
                                model_page?: string | null;
                            };
                            /** @description 模型架构信息 */
                            architecture: {
                                /**
                                 * @description 输入模态列表
                                 * @example [
                                 *       "text",
                                 *       "image"
                                 *     ]
                                 */
                                input_modalities: string[];
                                /**
                                 * @description 输出模态列表
                                 * @example [
                                 *       "text"
                                 *     ]
                                 */
                                output_modalities: string[];
                                /** @description 模型能力标记 */
                                schema_output?: {
                                    /**
                                     * @description 是否支持该能力
                                     * @example true
                                     */
                                    supported: boolean;
                                    /** @description 能力描述（支持 Markdown 格式） */
                                    description?: string;
                                };
                                /** @description 模型能力标记 */
                                function_calling?: {
                                    /**
                                     * @description 是否支持该能力
                                     * @example true
                                     */
                                    supported: boolean;
                                    /** @description 能力描述（支持 Markdown 格式） */
                                    description?: string;
                                };
                                /** @description 模型能力标记 */
                                reasoning?: {
                                    /**
                                     * @description 是否支持该能力
                                     * @example true
                                     */
                                    supported: boolean;
                                    /** @description 能力描述（支持 Markdown 格式） */
                                    description?: string;
                                };
                                /** @description 模型能力标记 */
                                content_cache?: {
                                    /**
                                     * @description 是否支持该能力
                                     * @example true
                                     */
                                    supported: boolean;
                                    /** @description 能力描述（支持 Markdown 格式） */
                                    description?: string;
                                };
                            };
                            /**
                             * @deprecated
                             * @description 定价规则列表
                             */
                            pricing_rules: {
                                /** @description 成本渠道名称（仅成本项使用） */
                                name?: string | null;
                                /**
                                 * @description 输入区间左右边界，`-1` 表示无上限
                                 * @example [
                                 *       0,
                                 *       -1
                                 *     ]
                                 */
                                input_range: number[];
                                /**
                                 * @description 输出区间左右边界，`-1` 表示无上限
                                 * @example [
                                 *       0,
                                 *       -1
                                 *     ]
                                 */
                                output_range: number[];
                                /**
                                 * @description 输入计费项类型
                                 * @example token
                                 */
                                input_item_type: string;
                                /**
                                 * @description 输出计费项类型
                                 * @example token
                                 */
                                output_item_type: string;
                                /**
                                 * @deprecated
                                 * @description 用量计费明细（V1 格式）。
                                 *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
                                 *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
                                 *     等多种计费项，每个字段均为 PricingMode 类型。
                                 */
                                details: {
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    total_prompt_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    total_completion_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    prompt_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    completion_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    reasoning_prompt_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    reasoning_completion_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    tts_bytes?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    asr_minutes?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    image_req_count?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    cached_hit?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    cache_storage?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                };
                                /**
                                 * @description 用量计费明细（V2 格式）。
                                 *     包含 input、output、cache、th_input、th_output 等计费项，
                                 *     每个字段均为 PricingItem 类型。
                                 */
                                details_v2: {
                                    /** @description 定价详情项 */
                                    input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    cache?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    th_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    th_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    nth_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    nth_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    i_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    i_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    a_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    a_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    v_duration?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    av_duration?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    minute?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    hbyte?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    req?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                };
                            }[];
                            /** @description 定价规则 V2 列表 */
                            pricing_rules_v2?: {
                                /** @description 成本渠道名称（仅成本项使用） */
                                name?: string | null;
                                /**
                                 * @description 输入区间左右边界，`-1` 表示无上限
                                 * @example [
                                 *       0,
                                 *       -1
                                 *     ]
                                 */
                                input_range: number[];
                                /**
                                 * @description 输出区间左右边界，`-1` 表示无上限
                                 * @example [
                                 *       0,
                                 *       -1
                                 *     ]
                                 */
                                output_range: number[];
                                /**
                                 * @description 输入计费项类型
                                 * @example token
                                 */
                                input_item_type: string;
                                /**
                                 * @description 输出计费项类型
                                 * @example token
                                 */
                                output_item_type: string;
                                /**
                                 * @deprecated
                                 * @description 用量计费明细（V1 格式）。
                                 *     包含 total_prompt_tokens、total_completion_tokens、prompt_tokens、
                                 *     completion_tokens、reasoning_prompt_tokens、reasoning_completion_tokens
                                 *     等多种计费项，每个字段均为 PricingMode 类型。
                                 */
                                details: {
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    total_prompt_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    total_completion_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    prompt_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    completion_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    reasoning_prompt_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    reasoning_completion_tokens?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    tts_bytes?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    asr_minutes?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    image_req_count?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    cached_hit?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                    /** @description 定价模式（区分实时推理和批量推理） */
                                    cache_storage?: {
                                        /** @description 定价详情项 */
                                        real_time?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                        /** @description 定价详情项 */
                                        batch?: {
                                            /**
                                             * @description 定价单位名称
                                             * @example token
                                             */
                                            unit_name: string;
                                            /**
                                             * Format: int64
                                             * @description 定价单位量
                                             * @example 1000
                                             */
                                            unit_size: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（人民币）
                                             * @example 0.05
                                             */
                                            unit_price: number;
                                            /**
                                             * Format: double
                                             * @description 每单位定价（美元）
                                             * @example 0.005
                                             */
                                            unit_price_usd: number;
                                            /**
                                             * @description 计费项中文名称
                                             * @example 输入
                                             */
                                            name: string;
                                        };
                                    };
                                };
                                /**
                                 * @description 用量计费明细（V2 格式）。
                                 *     包含 input、output、cache、th_input、th_output 等计费项，
                                 *     每个字段均为 PricingItem 类型。
                                 */
                                details_v2: {
                                    /** @description 定价详情项 */
                                    input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    cache?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    th_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    th_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    nth_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    nth_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    i_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    i_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    a_input?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    a_output?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    v_duration?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    av_duration?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    minute?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    hbyte?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                    /** @description 定价详情项 */
                                    req?: {
                                        /**
                                         * @description 定价单位名称
                                         * @example token
                                         */
                                        unit_name: string;
                                        /**
                                         * Format: int64
                                         * @description 定价单位量
                                         * @example 1000
                                         */
                                        unit_size: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（人民币）
                                         * @example 0.05
                                         */
                                        unit_price: number;
                                        /**
                                         * Format: double
                                         * @description 每单位定价（美元）
                                         * @example 0.005
                                         */
                                        unit_price_usd: number;
                                        /**
                                         * @description 计费项中文名称
                                         * @example 输入
                                         */
                                        name: string;
                                    };
                                };
                            }[];
                            /**
                             * @deprecated
                             * @description 限流配置，key 为限流类型（rpm/tpm/ipm/qpm）
                             * @example {
                             *       "rpm": {
                             *         "name": "RPM",
                             *         "quantity": 10000,
                             *         "unit_name": "requests",
                             *         "unit_time": 60
                             *       }
                             *     }
                             */
                            rate_limit: {
                                [key: string]: {
                                    /**
                                     * @description 限流项名称
                                     * @example RPM
                                     */
                                    name: string;
                                    /**
                                     * Format: int64
                                     * @description 限流数量
                                     * @example 10000
                                     */
                                    quantity: number;
                                    /**
                                     * @description 限流单位名称
                                     * @example requests
                                     */
                                    unit_name: string;
                                    /**
                                     * Format: int64
                                     * @description 限流单位时间（秒）
                                     * @example 60
                                     */
                                    unit_time: number;
                                };
                            };
                            /** @description 模型备案信息 */
                            model_filing: {
                                /**
                                 * @description 模型备案号
                                 * @example
                                 */
                                filing_no: string;
                            };
                            /**
                             * @deprecated
                             * @description 支持的请求参数列表
                             * @example [
                             *       "temperature",
                             *       "top_p",
                             *       "max_tokens",
                             *       "stream"
                             *     ]
                             */
                            supported_parameters: string[];
                            /**
                             * @description 支持的 API 协议列表
                             * @example [
                             *       "openai",
                             *       "anthropic"
                             *     ]
                             */
                            support_api_protocols: string[];
                            /**
                             * @description 模型排序权重
                             * @example 100
                             */
                            rank: number;
                            /**
                             * @description 模型退役时间（日期格式：2006-01-02），空字符串表示未设定
                             * @example
                             */
                            retirement_at: string;
                            /**
                             * @description 模型发布时间（日期格式：2006-01-02）
                             * @example 2024-05-13
                             */
                            release_at: string;
                            /**
                             * @description 模型退役后建议使用的新模型 ID
                             * @example
                             */
                            suggested_model: string;
                        }[];
                    };
                };
            };
            /** @description 参数错误或域名不支持海外模型 */
            "200 (error)": {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example false */
                        status: boolean;
                        /** @example 错误信息 */
                        error: string;
                    };
                };
            };
        };
    };
}
