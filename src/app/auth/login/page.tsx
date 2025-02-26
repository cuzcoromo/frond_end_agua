'use client';

// import useAuth from "@/hooks/useAuth";
// import useHttpRequest from "@/hooks/useHttpRequest";
import { Button, Col, Divider, Form, Input, Row } from "antd"
import { signIn } from "next-auth/react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useTransition } from "react";


const Login = () => {
  const [form] = Form.useForm();
  // const {httpRequest} = useHttpRequest();
  const [isPending, startTransition] = useTransition();
  // const {setToken, setUserData} = useAuth();
  // const router = useRouter();
  
  const onFinish = async (data: any) => {
    startTransition(async () => {
      const res = await signIn('credentials', {
        email: data?.email,
        password: data?.password,
        redirect: false,
      }
    );
    console.log(res);
      if (res?.error) {
        console.error('Error during sign in:', res.error);
      } else {
        console.log('Sign in successful');
        // Redirige al usuario a la página de inicio o dashboard
        // router.push('/');
      }
    });
  };

  return (
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
      <Button htmlType="submit" type="primary" disabled={isPending}>
        Guardar
      </Button>
    </Form>
    </div>
    </div>
  )
}

export default Login;
