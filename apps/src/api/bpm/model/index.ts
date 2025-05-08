import { requestClient } from '#/api/request';

export namespace BpmModelApi {
  /** 用户信息 TODO 这个是不是可以抽取出来定义在公共模块 */
  export interface UserInfo {
    id: number;
    nickname: string;
    avatar?: string;
    deptId?: number;
    deptName?: string;
  }
  /** 流程定义 VO */
  export interface ProcessDefinitionVO {
    id: string;
    version: number;
    deploymentTime: number;
    suspensionState: number;
    formType?: number;
  }

  /** 流程模型 VO */
  export interface ModelVO {
    id: number;
    key: string;
    name: string;
    icon?: string;
    description: string;
    category: string;
    formName: string;
    formType: number;
    formId: number;
    formCustomCreatePath: string;
    formCustomViewPath: string;
    processDefinition: ProcessDefinitionVO;
    status: number;
    remark: string;
    createTime: string;
    bpmnXml: string;
    startUsers?: UserInfo[];
  }

  /** 模型分类信息 */
  export interface ModelCategoryInfo {
    id: number;
    name: string;
    modelList: ModelVO[];
  }
}

/** 获取流程模型列表 */
export async function getModelList(name: string | undefined) {
  return requestClient.get<BpmModelApi.ModelVO[]>('/bpm/model/list', {
    params: { name },
  });
}

/** 获取流程模型详情 */
export async function getModel(id: string) {
  return requestClient.get<BpmModelApi.ModelVO>(`/bpm/model/get?id=${id}`);
}

/** 更新流程模型 */
export async function updateModel(data: BpmModelApi.ModelVO) {
  return requestClient.put('/bpm/model/update', data);
}

/** 批量修改流程模型排序 */
export async function updateModelSortBatch(ids: number[]) {
  const params = ids.join(',');
  return requestClient.put<boolean>(
    `/bpm/model/update-sort-batch?ids=${params}`,
  );
}

/** 更新流程模型的 BPMN XML */
export async function updateModelBpmn(data: BpmModelApi.ModelVO) {
  return requestClient.put('/bpm/model/update-bpmn', data);
}

/** 更新流程模型状态 */
export async function updateModelState(id: number, state: number) {
  const data = {
    id,
    state,
  };
  return requestClient.put('/bpm/model/update-state', data);
}

/** 创建流程模型 */
export async function createModel(data: BpmModelApi.ModelVO) {
  return requestClient.post('/bpm/model/create', data);
}

/** 删除流程模型 */
export async function deleteModel(id: number) {
  return requestClient.delete(`/bpm/model/delete?id=${id}`);
}

/** 部署流程模型 */
export async function deployModel(id: number) {
  return requestClient.post(`/bpm/model/deploy?id=${id}`);
}

/** 清理流程模型 */
export async function cleanModel(id: number) {
  return requestClient.delete(`/bpm/model/clean?id=${id}`);
}
