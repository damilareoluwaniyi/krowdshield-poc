import { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '@/context/AuthContext';
import { Shield, LogIn } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      if (password.length < 4) {
        setError('Invalid credentials. Password must be at least 4 characters.');
        setIsLoading(false);
        return;
      }
      
      login({
        id: `user-${Date.now()}`,
        username,
        role: isBusinessAccount ? 'business' : 'individual',
        safetyScore: 50,
      });
      
      router.replace('/home');
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'left']}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Shield size={40} color="#fff" />
            </View>
            <Text style={styles.logoText}>KrowdShield</Text>
            <Text style={styles.tagline}>Community-powered safety</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#94A3B8"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#94A3B8"
              />
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Business Account</Text>
              <Switch
                value={isBusinessAccount}
                onValueChange={setIsBusinessAccount}
                trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                thumbColor={isBusinessAccount ? '#3B82F6' : '#F1F5F9'}
              />
            </View>
            
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#94A3B8', '#64748B'] : ['#3B82F6', '#1D4ED8']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              {isLoading ? (
                <Text style={styles.loginButtonText}>Signing in...</Text>
              ) : (
                <View style={styles.loginButtonContent}>
                  <LogIn size={20} color="#fff" />
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#fff',
  },
  tagline: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    color: '#B91C1C',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  switchLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#475569',
  },
  loginButton: {
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontFamily: 'Inter-Regular',
    color: '#3B82F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  signUpText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    marginLeft: 5,
  },
});