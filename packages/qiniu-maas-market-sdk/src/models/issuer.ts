/** 模型发行方。 */
export interface Issuer {
  /** 发行方名称。 */
  name: string;
  /** 发行方图标 URL。 */
  avatar: string;
  /** 模型主页链接。 */
  model_page?: string | null;
}
