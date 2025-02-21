'use client';

import useAuth from "@/hooks/useAuth";
import useHttpRequest from "@/hooks/useHttpRequest";
import { Button, Col, Divider, Form, Input, message, Row } from "antd"
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [form] = Form.useForm();
  const {httpRequest} = useHttpRequest();
  const {setToken, setUserData} = useAuth();
  const router = useRouter();
  
  const onFinish = async (data:any) => {
    try {
      const res = await httpRequest('/signin',data, 'post');
      if(res.status === 200) {
        setToken(res?.data?.token);
        setUserData(res?.data);
        message.success('Bienvenido');
        router.push('/');
      }  
    } catch (error:any) {
      console.log(error)
      message.error('Upss ubo un error');
    }
  };

  return (
    // <div className="flex mx-auto justify-center items-center bg-gray-50 bg-opacity-80 h-screen">
    <div className="w-full max-w-md bg-white shadow">
      <div className="p-10 bg-white">
      
    <Form form={form} onFinish={onFinish} layout="vertical" style={{background:'white'}}>
        <Divider className="!text-blue-500 !text-xl">Login</Divider>
      <Row>
        <Col span={24}>
            <Form.Item
            label='Emial'
            name='email'
            rules={[{required:true, message:'Campo ocligatorio'}]}
            >
                <Input placeholder="Ingrese email" style={{border:'none', borderBottom:'2px dashed #cce0ff ',  outline: 'none',}}
                  onFocus={(e) => e.target.style.boxShadow = 'none'}
                />
            </Form.Item>
        </Col>
        <Col span={24}>
            <Form.Item
            label='Password'
            name={'password'}
            rules={[{required:true, message:'Campo ocligatorio'}]}
            >
                <Input.Password placeholder="Ingrese email" style={{border:'none', borderBottom:'2px dashed #cce0ff ',outline: 'none',  boxShadow: 'none'}}
                onFocus={(e) => e.target.style.boxShadow = 'none'}
                />
            </Form.Item>
        </Col>
      </Row>
      <Row className="!text-blue-500" align={'middle'} justify='end'>
        <Link href={'/auth/register'}>
          Registrar
        </Link>
      </Row>
      <Button htmlType="submit" type="primary">
        Guardar
      </Button>
    </Form>
    </div>
    </div>
  )
}

export default Login;
