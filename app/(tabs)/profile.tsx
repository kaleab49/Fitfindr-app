import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { colors } from '../../constants/colors';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          isDark ? colors.dark.surface : colors.light.surface,
          isDark ? colors.dark.background : colors.light.background,
        ]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.avatarContainer}>
              <Ionicons 
                name="person" 
                size={60} 
                color={isDark ? colors.textLight : colors.textDark} 
              />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.name, { color: isDark ? colors.textLight : colors.textDark }]}>
            John Doe
          </Text>
          <Text style={[styles.bio, { color: isDark ? colors.textLight : colors.textDark }]}>
            Fitness Enthusiast
          </Text>
        </View>

        <View style={styles.statsContainer}>
          {[
            { label: 'Workouts', value: '24' },
            { label: 'Following', value: '210' },
            { label: 'Followers', value: '158' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: isDark ? colors.textLight : colors.textDark }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? colors.accent3 : colors.accent3 }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.menuContainer}>
          {[
            { icon: 'bookmark-outline', label: 'Saved' },
            { icon: 'help-circle-outline', label: 'Help' },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={isDark ? colors.textLight : colors.textDark} 
              />
              <Text style={[
                styles.menuText,
                { color: isDark ? colors.textLight : colors.textDark }
              ]}>
                {item.label}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.accent3} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.accent1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.accent1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: colors.accent1,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent1,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
}); 