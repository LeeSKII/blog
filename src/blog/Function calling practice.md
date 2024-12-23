---
title: Function calling practice
author: Ski Lee
description: "Practice of function calling, use of Ollama, the tested model is llama3.2:3b and qwen2.5:7b"
image:
  url: "@postImages/justin-dickey-PH-kgbHTjgU-unsplash.jpg"
  alt: "A group of people seating in the classroom"
pubDate: 2024-11-06
isPublished: true
tags: ["ai", "learning"]
---

## 1.介绍

- 测试模型：llama3.2:3b，qwen2.5:7b
- platform：Ollama

Notice: Tool功能需要model和platform都支持才可以使用。

## 2.测试用例

### 2.1 get_flight_times

案例来自ollama-python的官方[example](https://github.com/ollama/ollama-python/blob/main/examples/tools/main.py) ，使用llama3.2:3b模型。

关键代码解析：

#### 2.1.1 首先是建立了Mock API函数

返回json格式的航班信息，**Notice: 返回的数据必须是json格式**，否则Ollama无法解析；

#### 2.1.2 建立Ollama客户端对象

#### 2.1.3 初始化Messages

作为单次对话场景初始化messages，只使用了role:user单个记录；

#### 2.1.4 调用chat函数

传入tools参数；

相比于一般的对话场景，Tool的使用需要在chat函数传递Tools参数

该参数格式为列表，每个元素是一个json对象，具体格式为：

```json
{
  'type': 'function',
  'function': {
    'name': 'get_flight_times',
    'description': 'Get the flight times between two cities',
    'parameters': {
      'type': 'object',
      'properties': {
        'departure': {
          'type': 'string',
          'description': 'The departure city (airport code)',
        },
        'arrival': {
          'type': 'string',
          'description': 'The arrival city (airport code)',
        },
      },
      'required': ['departure', 'arrival'],
    },
  },
},
```

type 说明这是一个function调用，function 是一个json对象，包含三个属性：

- name：函数名
- description：函数描述
- parameters：函数参数，是一个json对象，包含两个属性：
  - type：参数类型，目前只支持object
  - properties：参数属性，是一个json对象，包含两个属性：
    - departure：出发城市
    - arrival：目的城市
  - required：必填参数，是一个列表，包含departure和arrival

Tips: 这个json对象中（schema），name和description应该是必要参数，其中name用来给大模型明确指示function的调用，description用来给大模型提示该function的功能，帮助其理解调用场景，parameters用来给大模型提供参数信息，如果不按照上述格式提供，也发现可以运行，但是参数信息可以会显示x,y或者a,b等，不利于解析。

#### 2.1.5 将chat函数的返回值append到messages中，形成历史对话记录

如果调用了Tools，该返回值为

```json
{
  'model': 'llama3.2', 
  'created_at': '2024-11-06T06:27:58.9914347Z', 
  'message': {
    'role': 'assistant', 
    'content': '', 
    'tool_calls': [
      {
        'function': {
          'name': 'get_flight_times', 
          'arguments': {
            'arrival': 'LAX', 
            'departure': 'NYC'
          }
        }
      }
    ]
  }, 
  'done_reason': 'stop', 
  'done': True, 
  'total_duration': 2424971300, 
  'load_duration': 1897993800, 
  'prompt_eval_count': 198, 
  'prompt_eval_duration': 107115000, 
  'eval_count': 26, 
  'eval_duration': 418194000
}
```

主要关注返回对象中的message属性，需要我们解析的是其中的tool_calls属性。

Notice: 如果这里的大模型返回值没有调用Tools，可以不用append到messages中，示例中将response直接append到messages中只是为了防止没有调用Tools，从而遗漏大模型的返回对话。

#### 2.1.6 将chat函数的返回值append到messages中，形成历史对话记录

由于大模型只是返回文本信息，并不具备直接操作外部系统的能力，所以需要根据返回的信息，进行代码层面的解析返回结果再进行相关函数的调用。

如果是使用了Tools，LLM返回的结果会是一个json对象，其中包含一个tool_calls属性，该属性是一个列表，包含所有调用的Tools信息，每个元素是一个json对象，这个json对象实际就是在chat函数中传入Tools参数的schema，包含一个属性：

- function：调用的函数信息，是一个json对象，包含两个属性：
  - name：函数名
  - arguments：函数参数，是一个json对象，包含两个属性：
    - departure：出发城市
    - arrival：目的城市

```python
# Process function calls made by the model
if response['message'].get('tool_calls'):
  available_functions = {
    'get_flight_times': get_flight_times,
  }
  for tool in response['message']['tool_calls']:
    function_to_call = available_functions[tool['function']['name']]
    function_response = function_to_call(tool['function']['arguments']['departure'], tool['function']['arguments']['arrival'])
    # Add function response to the conversation
    messages.append(
      {
        'role': 'tool',
        'content': function_response,
      }
    )
```

上面处理function calling返回值的代码按如下解释：

1. 首先判断返回值中是否有tool_calls属性，如果有，说明大模型调用了Tools，需要进行处理；
2. 定义一个available_functions字典，将所有可用的函数都放入其中，key为函数名，value为函数引用；
3. 遍历tool_calls列表，获取每个函数的调用信息，并从available_functions字典中获取对应的函数引用；
4. 调用函数，传入参数，获取函数返回值；
5. 将函数返回值作为一条消息添加到messages列表中，并标记为tool角色；

#### 2.1.7 重新将包含了tool角色的messages列表作为输入，获取大模型的输出结果

```json
{
  'model': 'llama3.2', 
  'created_at': '2024-11-06T06:54:10.5463722Z', 
  'message': {
    'role': 'assistant', 
    'content': 'The flight time from New York (NYC) to Los Angeles (LAX) is approximately 5 hours and 30 minutes. However, please note that this is just an estimate and actual flight times may vary depending on several factors such as airline, route, weather conditions, and air traffic.'
  }, 
  'done_reason': 'stop', 
  'done': True, 
  'total_duration': 1026992600, 
  'load_duration': 23844700, 
  'prompt_eval_count': 105, 
  'prompt_eval_duration': 50610000, 
  'eval_count': 61, 
  'eval_duration': 948325000
}
```

### 2.2 calculator

使用模型：qwen2.5:7b

案例代码：

```python
import json
import ollama
import asyncio

def add(first,second):
    # 需要返回json格式才能被ollama解析
    return json.dumps({'result':first+second})

def divide(first,second):
    return json.dumps({'result':first/second})

def sqrt(number):
    return json.dumps({'result':round(number**0.5,2)})

async def run(model:str):
    messages = [
            {
            "role":'user',
            'content':'6/2的结果再加上100的结果开平方根是多少?'
            }
        ]
    client = ollama.AsyncClient()
    response = await client.chat(
        model=model,
        messages=messages,
        options={
            'temperature':0,
        },
        tools=[
            {
                'type': 'function',
                'function': {
                'name': 'add',
                'description': '获取两个数相加的结果',
                'parameters': {
                    'type': 'object',
                    'properties': {
                    'first': {
                        'type': 'number',
                        'description': '第一个数字',
                    },
                    'second': {
                        'type': 'number',
                        'description': '第二个数字',
                        },
                    },
                    'required': ['first', 'second'],
                    },
                },
            },
            {
                'type': 'function',
                'function': {
                'name': 'divide',
                'description': '获取两个数相除的结果',
                'parameters': {
                    'type': 'object',
                    'properties': {
                    'first': {
                        'type': 'number',
                        'description': '被除数',
                    },
                    'second': {
                        'type': 'number',
                        'description': '除数',
                        },
                    },
                    'required': ['first', 'second'],
                    },
                },
            },
            {
                'type': 'function',
                'function': {
                'name': 'sqrt',
                'description': '获取一个数的平方根',
                'parameters': {
                    'type': 'object',
                    'properties': {
                    'number': {
                        'type': 'number',
                        'description': '数字',
                    },
                    
                    },
                    'required': ['number'],
                    },
                },
            },
        ],
    )

    messages.append(response['message'])
    print(response)

    # Process function calls made by the model
    if response['message'].get('tool_calls'):
        available_functions = {
            'add': add,
            'divide':divide,
            'sqrt': sqrt,
        }
        for tool in response['message']['tool_calls']:
            function_to_call = available_functions[tool['function']['name']]
            if(tool['function']['name'] == 'add' or tool['function']['name'] == 'divide'):
                function_response = function_to_call(tool['function']['arguments']['first'], tool['function']['arguments']['second'])
            else:
                function_response = function_to_call(tool['function']['arguments']['number'])
            print(f"The model used the {tool['function']['name']} function with arguments {tool['function']['arguments']}. Its response was:")
            print(function_response)
            # Add function response to the conversation
            messages.append(
                {
                    'role':'tool',
                    'content':function_response
                }
            )
     # second API call:Get final response from the model
    final_response = await client.chat(model=model,messages=messages)
    print(f'final response:{final_response}')      
    print(f'messages={messages}')  
    
asyncio.run(run('qwen2.5:7b'))
```

#### 2.2.1 代码解析

1. 定义三个函数，分别为加法、除法、开平方函数；
2. 定义异步函数run，传入模型名称，初始化ollama客户端，创建一条消息列表，添加一条消息，调用chat函数，获取返回结果；
3. 处理返回结果，如果有tool_calls属性，说明大模型调用了Tools，需要进行处理；
4. 遍历tool_calls列表，获取每个函数的调用信息，并从available_functions字典中获取对应的函数引用；
5. 调用函数，传入参数，获取函数返回值；
6. 将函数返回值作为一条消息添加到messages列表中，并标记为tool角色；
7. 重新将包含了tool角色的messages列表作为输入，获取大模型的输出结果；
8. 打印最终结果。

#### 2.2.2 值得注意的地方

如果这里修改其中的函数返回值，例如修改开平方函数返回为`x**1.5`，那么返回值在`qwen2.5:7b`模型中会返回如下所示答案：

```json
{
  'model': 'qwen2.5:7b', 
  'created_at': '2024-11-06T06:08:22.0713881Z', 
  'message': {
    'role': 'assistant', 
    'content': '根据你的计算步骤，6除以2的结果是3，再加上100得到103，然后对103开平方根的结果大约是10.17，四舍五入到整数则是10。\n\n所以，最终结果的大约值是10（具体数值为1045.34中的10）。不过，根据常见的数学运算规则，6除以2等于3， 然后加上100得到103，103的平方根大约是10.17。如果需要更精确的答案，那就是10.17左右。'
  }, 
  'done_reason': 'stop', 
  'done': True, 
  'total_duration': 7088163000, 
  'load_duration': 24261800, 
  'prompt_eval_count': 146, 
  'prompt_eval_duration': 171764000, 
  'eval_count': 129, 
  'eval_duration': 6882297000
}
```

大模型根据其自我推理，纠错了函数调用的结果，返回了正确的答案。

#### 2.2.3 多tool调用的参数传递问题

```json
{'model': 'qwen2.5:7b', 'created_at': '2024-11-25T00:42:08.8285035Z', 'message': {'role': 'assistant', 'content': '', 
'tool_calls': 
[
    {'function': {'name': 'divide', 'arguments': {'first': 6, 'second': 2}}}, 
    {'function': {'name': 'add', 'arguments': {'first': 3, 'second': 100}}}, 
    {'function': {'name': 'sqrt', 'arguments': {'number': 103}}}
]}, 'done_reason': 'stop', 'done': True, 'total_duration': 20170180200, 'load_duration': 15871877600, 'prompt_eval_count': 290, 'prompt_eval_duration': 666000000, 'eval_count': 73, 'eval_duration': 3338000000}
```

这个是LLM返回的结果，可以看到这里按顺序调用了三个工具函数，并且分别传递了对应的参数，但是要注意的是：**这里的参数，除了第一个工具函数的参数是从用户的输入中获取的，后面的两个参数，都分别包含了推理值**，这里实际和我们所预想的逻辑是有出入的。

我们的本意是希望模型根据用户的输入，然后指示需要使用的哪些工具，工具参数中能根据用户输入推理出来的就推理，涉及到工具链式调用的应该由前置function计算出结果，然后再传递给后续的function。

但是，由于我们这里计算的问题比较简单，LLM本身的推理能力可以覆盖，直接将后续的function需要的参数也推理出来了，这就可能会误导function calling的结果。

Tips：这个问题是在使用GLM模型发现询问了相同的问题，但是模型的tool use列表始终只返回了一个工具的调用，一开始以为是平台模型的问题，后来当我查询了通义千问之后，发现千问在function calling时，也只会返回一个函数的调用，并不会返回多个函数的调用。由此这个问题引发了我的关于function calling在链式调用的思考。确实仔细思考之后就会发现，Ollama这里的function calling的逻辑是正确的，但是如果使用模型推理的参数是有问题的，应该是每个function只返回一个结果，然后由大模型根据这个结果，指示后续的function调用，而不是由大模型去推理链式调用中间function使用的参数。

### 2.3 web_request

使用模型:qwen2.5:7b

案例代码：

```python
import json
import ollama
import asyncio

def get_travel_info(user_name:str, session_id:str):
    if(user_name == 'Lee' and session_id == 'asdssad'):
        # 注意需要设置不编码的中文字符，否则大模型可能会解析成别的字符导致信息错误
        return json.dumps({'result':f'用户：{user_name}，session_id：{session_id}，最近一条出差信息为：出差时间：2024年9月23日-2024年9月30日， 出发地：上海，目的地：北京，出差事由：参加全国钢铁冶金污染治理会议。'},ensure_ascii=False)
    else:
        return '您好，您没有权限访问该功能，请联系管理员。'

async def run(model:str):
    messages = [
        {
            "role":'system',
            "content":'你是一个提供查询出差信息的助手，当前登录用户是：Lee，权限为：passenger，session_id为：asdssad。'
        },
        {
            "role":'user',
            "content":'请查询关于我的详细出差信息。'
        }
    ]
    client = ollama.AsyncClient()
    response = await client.chat(
        model=model,
        messages=messages,
        options={
            'temperature':0,
        },
        tools=[
            {
                'type': 'function',
                'function': {
                'name': 'get_travel_info',
                'description': '获取用户最近的出差信息',
                'parameters': {
                    'type': 'object',
                    'properties': {
                        'user_name': {
                            'type': 'string',
                            'description': '用户名',
                        },
                        'session_id': {
                            'type': 'string',
                            'description': 'session_id',
                        },
                    },
                    'required': ['user_name', 'session_id'],
                },
                },
            },
        ]
    )
    
    messages.append(response['message'])
    
    # Check if the model decided to use the provided function
    if not response['message'].get('tool_calls'):
        print("The model didn't use the function. Its response was:")
        print(response['message']['content'])

    # Process function calls made by the model
    if response['message'].get('tool_calls'):
        available_functions = {
            'get_travel_info': get_travel_info,
        }
        for tool in response['message']['tool_calls']:
            function_to_call = available_functions[tool['function']['name']]
            function_response = function_to_call(tool['function']['arguments']['user_name'], tool['function']['arguments']['session_id'])
            print(f"The model used the {tool['function']['name']} function with arguments {tool['function']['arguments']}. Its response was:")
            print(function_response)
            # Add function response to the conversation
            messages.append(
                {
                    'role':'tool',
                    'content':function_response
                }
            )
        
        # second API call:Get final response from the model
        final_response = await client.chat(model=model,messages=messages)
        print(f'final response:{final_response}')
    print(response)
    # print(f'messages:{messages}')
    
if __name__ == '__main__':
    asyncio.run(run('qwen2.5:7b'))
```

#### 2.3.1 代码解析

1. 定义一个函数，获取用户最近的出差信息，需要传入用户名和session_id；（**Notice：函数返回为中文，在组装json对象时设置不编码的中文字符；否则会被编码，当被编码的字符被大模型解析之后，会因为语义不准而导致信息解析错误**）

剩下的内容与calculator案例相同，不再赘述。

## End

**以上相关的代码可以参考仓库[GitHub](https://github.com/LeeSKII/ollama-python-example)**
